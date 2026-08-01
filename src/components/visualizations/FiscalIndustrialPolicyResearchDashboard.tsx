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
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AE_EMDE_EXTENSIVE,
  HEADLINE,
  INSTRUMENT_MIX,
  JURISDICTION_COVERAGE,
  NIPO_2023_LEVELS,
  POLICY_PACKAGES,
  SECURITY_INSTRUMENT_SHIFT,
  SOURCE_NOTE,
  SOURCES,
  fmtBn,
  fmtInt,
  fmtPct,
  type PackageRow,
} from "@/data/fiscal-industrial-policy-research-2026-data";

// viz-types: area-trend, stacked-bar, donut, diverging-bar, horizontal-bar | layout: default

type CoverageMetric = "distortingPct" | "subsidiesPct" | "tradePct" | "localizationPct";
type MixGroup = "Advanced economies" | "Emerging & developing" | "Both";
type SectorFilter = "All" | "Semiconductors" | "Clean energy / manufacturing" | "Strategic tech";

const COLORS = {
  distorting: "#0f766e",
  subsidies: "#4f46e5",
  trade: "#dc2626",
  localization: "#d97706",
  other: "#64748b",
  plans: "#6366f1",
  policies: "#0ea5e9",
  firm: "#f59e0b",
  pre: "#94a3b8",
  post: "#be123c",
};

const COVERAGE_META: Record<
  CoverageMetric,
  { label: string; color: string; description: string }
> = {
  distortingPct: {
    label: "Any trade-distorting IP",
    color: COLORS.distorting,
    description: "Share of monitored jurisdictions using at least one distorting industrial-policy tool",
  },
  subsidiesPct: {
    label: "Distorting subsidies",
    color: COLORS.subsidies,
    description: "Share deploying trade-distorting subsidies / state aid",
  },
  tradePct: {
    label: "Import / export measures",
    color: COLORS.trade,
    description: "Share using import or export barriers (mid-band where IMF discloses a range)",
  },
  localizationPct: {
    label: "Localization policies",
    color: COLORS.localization,
    description: "Share using localisation / local-content rules",
  },
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FiscalIndustrialPolicyResearchDashboard() {
  const [coverageMetric, setCoverageMetric] = useState<CoverageMetric>("subsidiesPct");
  const [mixGroup, setMixGroup] = useState<MixGroup>("Both");
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("All");
  const [selectedPackage, setSelectedPackage] = useState<string>("us-chips");

  const coverageMeta = COVERAGE_META[coverageMetric];

  const mixData = useMemo(() => {
    const rows = INSTRUMENT_MIX.filter((r) => mixGroup === "Both" || r.group === mixGroup);
    return rows.map((r) => ({
      label: `${r.group === "Advanced economies" ? "AE" : "EMDE"} ${r.period}`,
      group: r.group,
      period: r.period,
      Subsidies: r.subsidiesPct,
      Trade: r.tradePct,
      Localization: r.localizationPct,
      Other: r.otherPct,
    }));
  }, [mixGroup]);

  const packages = useMemo(() => {
    const rows =
      sectorFilter === "All"
        ? POLICY_PACKAGES
        : POLICY_PACKAGES.filter((p) => p.sector === sectorFilter);
    return [...rows].sort((a, b) => b.usdBn - a.usdBn);
  }, [sectorFilter]);

  const selected: PackageRow =
    POLICY_PACKAGES.find((p) => p.id === selectedPackage) ?? POLICY_PACKAGES[0];

  const extensiveCompare = useMemo(
    () =>
      AE_EMDE_EXTENSIVE.filter((r) => r.year === 2009 || r.year === 2023).map((r) => ({
        ...r,
        label: `${r.group === "Advanced economies" ? "AE" : "EMDE"} ${r.year}`,
      })),
    [],
  );

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";

  return (
    <div
      className="site-content w-full min-w-0 space-y-6"
      data-viz="fiscal-industrial-policy-research-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Global industrial policy — NIPO / IMF
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Subsidy jurisdictions nearly doubled: {fmtPct(HEADLINE.subsidyJurisdictions2009Pct)} →{" "}
          {fmtPct(HEADLINE.subsidyJurisdictions2023Pct)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Across {fmtInt(HEADLINE.hNipoInterventions)} H-NIPO interventions (2009–2023),{" "}
          {fmtPct(HEADLINE.tradeDistortiveSharePct)} were trade-distorting and China + EU + US
          accounted for ~{fmtPct(HEADLINE.chinaEuUsSharePct)}. In the 2023 NIPO wave alone,{" "}
          {fmtInt(HEADLINE.nipo2023Total)} measures were recorded — {fmtPct(HEADLINE.nipo2023DistortivePct)}{" "}
          trade-distorting — with {fmtInt(HEADLINE.importMeasuresWithCoverage)} import measures
          covering at least {fmtPct(HEADLINE.importCoveragePct)} of global trade.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <ToggleGroup
          label="Coverage metric"
          value={coverageMetric}
          onChange={setCoverageMetric}
          options={[
            { id: "subsidiesPct", label: "Subsidies" },
            { id: "distortingPct", label: "Any distorting" },
            { id: "tradePct", label: "Trade barriers" },
            { id: "localizationPct", label: "Localization" },
          ]}
        />
        <ToggleGroup
          label="Instrument mix"
          value={mixGroup}
          onChange={setMixGroup}
          options={[
            { id: "Both", label: "AE + EMDE" },
            { id: "Advanced economies", label: "AE only" },
            { id: "Emerging & developing", label: "EMDE only" },
          ]}
        />
        <div>
          <label htmlFor="fip-sector" className="mb-1 block text-sm font-medium text-slate-700">
            Package sector
          </label>
          <select
            id="fip-sector"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as SectorFilter)}
            className={`${selectClass} min-w-[200px]`}
          >
            <option value="All">All sectors</option>
            <option value="Semiconductors">Semiconductors</option>
            <option value="Clean energy / manufacturing">Clean energy / manufacturing</option>
            <option value="Strategic tech">Strategic tech</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Jurisdiction coverage: who is intervening?"
          subtitle={coverageMeta.description}
        >
          <p className="mb-3 text-sm text-slate-600" data-viz-marker="Jurisdiction coverage trend">
            {coverageMeta.label}: {fmtPct(HEADLINE.subsidyJurisdictions2009Pct)} of jurisdictions in
            2009 → {fmtPct(HEADLINE.subsidyJurisdictions2023Pct)} in 2023 for subsidies; distorting-IP
            use peaked at {fmtPct(HEADLINE.distortingPeakPct)} in 2020 and 2022.
          </p>
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={JURISDICTION_COVERAGE} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  width={42}
                />
                <Tooltip
                  formatter={(value) => [fmtPct(Number(value), 0), coverageMeta.label]}
                  labelFormatter={(l) => `Year ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey={coverageMetric}
                  name={coverageMeta.label}
                  stroke={coverageMeta.color}
                  fill={coverageMeta.color}
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Hollow years between disclosed endpoints are interpolated — hover series points in the
            data file notes for confidence flags.
          </p>
        </ChartCard>

        <ChartCard
          title="Instrument mix: subsidies vs tariffs inside the toolkit"
          subtitle="Share of industrial-policy measures by instrument class (IMF WP/25/222)"
        >
          <p className="mb-3 text-sm text-slate-600" data-viz-marker="Stacked bars: instrument mix">
            Advanced economies still lean on subsidies ({fmtPct(HEADLINE.aeSubsidyShare2009Pct)} →{" "}
            {fmtPct(HEADLINE.aeSubsidyShare2023Pct)}), but trade tools rose from{" "}
            {fmtPct(HEADLINE.aeTradeShare2009Pct)} to {fmtPct(HEADLINE.aeTradeShare2023Pct)}. EMDEs
            converged toward subsidy-heavy mixes ({fmtPct(HEADLINE.emdeSubsidyShare2009Pct)} →{" "}
            {fmtPct(HEADLINE.emdeSubsidyShare2023Pct)}).
          </p>
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mixData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={42} />
                <Tooltip formatter={(value) => fmtPct(Number(value), 0)} />
                <Legend />
                <Bar dataKey="Subsidies" stackId="a" fill={COLORS.subsidies} />
                <Bar dataKey="Trade" stackId="a" fill={COLORS.trade} />
                <Bar dataKey="Localization" stackId="a" fill={COLORS.localization} />
                <Bar dataKey="Other" stackId="a" fill={COLORS.other} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="2023 NIPO stack: plans, policies, firm awards"
          subtitle={`${fmtInt(HEADLINE.nipo2023Total)} recorded interventions — China + EU + US ≈ ${fmtPct(HEADLINE.chinaEuUsShare2023Pct)}`}
        >
          <p className="mb-3 text-sm text-slate-600" data-viz-marker="Donut: 2023 NIPO levels">
            Most activity is not a headline strategy document — it is regulations and firm-level
            awards that actually change competitive conditions.
          </p>
          <div className="flex h-72 flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="h-56 w-full max-w-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={NIPO_2023_LEVELS}
                    dataKey="count"
                    nameKey="shortLabel"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {NIPO_2023_LEVELS.map((row) => (
                      <Cell
                        key={row.level}
                        fill={
                          row.shortLabel === "Plans"
                            ? COLORS.plans
                            : row.shortLabel === "Policies"
                              ? COLORS.policies
                              : COLORS.firm
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [fmtInt(Number(value)), String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {NIPO_2023_LEVELS.map((row) => (
                <li key={row.level} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{
                      background:
                        row.shortLabel === "Plans"
                          ? COLORS.plans
                          : row.shortLabel === "Policies"
                            ? COLORS.policies
                            : COLORS.firm,
                    }}
                  />
                  <span>
                    {row.level}: <strong>{fmtInt(row.count)}</strong> ({fmtPct(row.sharePct, 1)})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard
          title="Security motives: export barriers displace procurement"
          subtitle="Instrument mix inside national-security / geopolitics measures (pre- vs post-2020)"
        >
          <p className="mb-3 text-sm text-slate-600" data-viz-marker="Diverging bars: security instruments">
            Export barriers rose from {fmtPct(HEADLINE.securityExportBarrierPre2020Pct)} to{" "}
            {fmtPct(HEADLINE.securityExportBarrierPost2020Pct)} of security-motivated measures —
            while localisation and import barriers shrank as a share of that motive class.
          </p>
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SECURITY_INSTRUMENT_SHIFT}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 40]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="motive"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(value) => fmtPct(Number(value), 0)} />
                <Legend />
                <Bar
                  dataKey="pre2020ExportBarrierPct"
                  name="2009–2019 share"
                  fill={COLORS.pre}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="post2020ExportBarrierPct"
                  name="2020–2023 share"
                  fill={COLORS.post}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Fiscal packages: statutory industrial-policy war chests"
        subtitle="Headline appropriations, mobilisation targets, and tax-credit scores — not cumulative outlays"
      >
        <p className="mb-3 text-sm text-slate-600" data-viz-marker="Horizontal bars: policy packages">
          Click a bar to inspect metric type. CHIPS appropriations alone are {fmtBn(HEADLINE.chipsAppropriatedUsdBn)};
          IRA clean-energy tax expenditures dwarf chip grants on paper.
        </p>
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={packages}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="shortLabel"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, _n, item) => {
                  const row = item?.payload as PackageRow | undefined;
                  return [fmtBn(Number(value)), row?.packageName ?? "Package"];
                }}
              />
              <Bar
                dataKey="usdBn"
                name="Headline USD bn"
                radius={[0, 4, 4, 0]}
                cursor="pointer"
                onClick={(data) => {
                  const id = (data as { id?: string })?.id;
                  if (id) setSelectedPackage(id);
                }}
              >
                {packages.map((p) => (
                  <Cell
                    key={p.id}
                    fill={p.id === selected.id ? COLORS.subsidies : "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{selected.packageName}</p>
          <p className="mt-1">
            {selected.jurisdiction} · {selected.sector} · {selected.year} ·{" "}
            <strong>{fmtBn(selected.usdBn)}</strong> ({selected.metric}, {selected.confidence})
          </p>
          {selected.note && <p className="mt-2 text-xs text-slate-500">{selected.note}</p>}
        </div>
      </ChartCard>

      <ChartCard
        title="AE vs EMDE extensive margin (2009 → 2023)"
        subtitle="Share of jurisdictions in each income group deploying each tool"
      >
        <div className="h-64 w-full min-w-0" data-viz-marker="Grouped bars: AE vs EMDE coverage">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={extensiveCompare} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={42} />
              <Tooltip formatter={(value) => fmtPct(Number(value), 0)} />
              <Legend />
              <Bar dataKey="subsidiesPct" name="Subsidies" fill={COLORS.subsidies} radius={[4, 4, 0, 0]} />
              <Bar dataKey="tradePct" name="Trade barriers" fill={COLORS.trade} radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="localizationPct"
                name="Localization"
                fill={COLORS.localization}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a href={s.url} className="underline hover:text-slate-700" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
