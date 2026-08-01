"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  BUDGET_YARDSTICKS,
  FAMILY_COLORS,
  HEADLINE,
  JCT_AGGREGATE,
  SCOPE_SLOPE,
  SOURCE_NOTE,
  SOURCES,
  familyShares,
  fmtBn,
  fmtTn,
  rankedJctTop10,
  rankedTreasuryHeadlines,
  type ScopeId,
} from "@/data/fiscal-plumbing-research-2026-data";

// viz-types: ranked lollipop bars, family bars, treasury↔JCT grouped bars, budget yardstick bars | layout: canvas

type Panel = "rank" | "families" | "slope" | "yardsticks" | "cumulative";

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
              value === o.id ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BnTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold text-slate-800">{label}</p>}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600">
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: {fmtBn(Number(p.value) || 0)}
        </p>
      ))}
    </div>
  );
}

export function FiscalPlumbingResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("rank");
  const [scope, setScope] = useState<ScopeId>("jct");

  const ranked = useMemo(
    () => (scope === "jct" ? rankedJctTop10() : rankedTreasuryHeadlines()),
    [scope],
  );

  const lollipop = useMemo(
    () =>
      ranked.map((r) => ({
        name: r.shortLabel,
        bn: r.fy2026Bn,
        fill: FAMILY_COLORS[r.family],
      })),
    [ranked],
  );

  const families = useMemo(() => familyShares(scope), [scope]);

  const yardsticks = useMemo(
    () => [...BUDGET_YARDSTICKS].sort((a, b) => b.bn - a.bn),
    [],
  );

  return (
    <div className="space-y-6" data-viz="fiscal-plumbing-research-2026">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
          Fiscal plumbing — tax expenditures as off-budget spend
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          JCT: {fmtTn(HEADLINE.jctFy2026Tn)} in FY2026 tax expenditures — larger than Social Security
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Top-10 JCT lines alone are ~{fmtBn(HEADLINE.jctTop10Bn)}. Treasury’s ESI exclusion is{" "}
          {fmtBn(HEADLINE.treasuryEsiBn)} vs JCT’s {fmtBn(HEADLINE.jctEsiBn)} — a{" "}
          {fmtBn(HEADLINE.scopeGapEsiBn)} packaging gap on the same economic idea.
        </p>
        <p className="mt-3 text-xs text-slate-400">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "rank", label: "Ranked cost" },
            { id: "cumulative", label: "Top-N build-up" },
            { id: "families", label: "By family" },
            { id: "slope", label: "Treasury ↔ JCT" },
            { id: "yardsticks", label: "Budget scale" },
          ]}
        />
        {(panel === "rank" || panel === "families" || panel === "cumulative") && (
          <ToggleGroup
            label="Scope"
            value={scope}
            onChange={setScope}
            options={[
              { id: "jct", label: "JCT top 10" },
              { id: "treasury", label: "Treasury headlines" },
            ]}
          />
        )}
      </div>

      {panel === "cumulative" && (
        <ChartCard
          title="How fast the top-N stack reaches ~⅔ of JCT cost"
          subtitle="Running sum of JCT top 10 (still not a joint repeal score). Area = cumulative $."
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={rankedJctTop10().reduce<
                  { n: number; label: string; cumulativeBn: number }[]
                >((acc, row, i) => {
                  const prev = acc[i - 1]?.cumulativeBn || 0;
                  acc.push({
                    n: i + 1,
                    label: `Top ${i + 1}`,
                    cumulativeBn: prev + row.fy2026Bn,
                  });
                  return acc;
                }, [])}
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis tickFormatter={(v) => `$${v}B`} stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<BnTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulativeBn"
                  name="Cumulative top-N"
                  stroke="#f59e0b"
                  fill="#fbbf24"
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "rank" && (
        <ChartCard
          title={
            scope === "jct"
              ? "JCT largest tax expenditures (FY2026)"
              : "Treasury published FY2026 headline items"
          }
          subtitle="Lollipop ranked highest → lowest. Do not sum as a joint repeal score."
        >
          <div className="h-[420px] min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lollipop} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v}B`} stroke="#94a3b8" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip content={<BnTooltip />} />
                <Bar dataKey="bn" name="FY2026 cost" barSize={10} radius={[0, 4, 4, 0]}>
                  {lollipop.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "families" && (
        <ChartCard
          title="Composition by policy family"
          subtitle={`${scope === "jct" ? "JCT top 10" : "Treasury headlines"} rolled into families (share of this list, not of all tax law).`}
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={families} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="family" stroke="#94a3b8" fontSize={11} />
                <YAxis tickFormatter={(v) => `$${v}B`} stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<BnTooltip />} />
                <Bar dataKey="bn" name="FY2026 $" radius={[4, 4, 0, 0]}>
                  {families.map((f) => (
                    <Cell
                      key={f.family}
                      fill={FAMILY_COLORS[f.family as keyof typeof FAMILY_COLORS] || "#64748b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            JCT top-10 ≈ {((JCT_AGGREGATE.top10ShareOfTotalApprox || 0) * 100).toFixed(0)}% of the{" "}
            {fmtTn(JCT_AGGREGATE.fy2026Tn)} aggregate (approximate).
          </p>
        </ChartCard>
      )}

      {panel === "slope" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Same idea, different packaging"
            subtitle="Grouped bars: Treasury FY2026 estimate vs JCT FY2026 for related concepts."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SCOPE_SLOPE.map((r) => ({
                    name: r.concept.length > 28 ? `${r.concept.slice(0, 26)}…` : r.concept,
                    Treasury: r.treasuryBn,
                    JCT: r.jctBn,
                  }))}
                  margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} />
                  <YAxis tickFormatter={(v) => `$${v}B`} stroke="#94a3b8" fontSize={11} />
                  <Tooltip content={<BnTooltip />} />
                  <Bar dataKey="Treasury" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="JCT" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Why the ESI gap exists" subtitle="Methodology, not a spreadsheet error.">
            <ul className="space-y-3 text-sm text-slate-700">
              {SCOPE_SLOPE.map((row) => (
                <li key={row.concept} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">{row.concept}</p>
                  <p className="mt-1 text-slate-600">
                    Treasury {fmtBn(row.treasuryBn)} → JCT {fmtBn(row.jctBn)}. {row.note}.
                  </p>
                </li>
              ))}
              <li className="text-xs text-slate-500">
                Treasury FAQ also lists imputed rent and DC plans that JCT folds into broader retirement /
                housing concepts — another reason rankings disagree even when both are “official.”
              </li>
            </ul>
          </ChartCard>
        </div>
      )}

      {panel === "yardsticks" && (
        <ChartCard
          title="If tax expenditures were a budget line"
          subtitle="JCT FY2026 aggregate vs approximate major outlay blocks (scale comparison, not identical accounting)."
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yardsticks} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v / 1000}T`} stroke="#94a3b8" fontSize={11} />
                <YAxis type="category" dataKey="label" width={200} stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<BnTooltip />} />
                <Bar dataKey="bn" name="Approx FY$" radius={[0, 4, 4, 0]}>
                  {yardsticks.map((y) => (
                    <Cell key={y.id} fill={y.kind === "tax-code" ? "#f59e0b" : "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs text-slate-500">
        Sources: {SOURCES.join(" · ")}
      </p>
    </div>
  );
}
