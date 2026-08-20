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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  DEPLETION_PATH,
  FAMILY_COLORS,
  HEADLINE,
  JCT_AGGREGATE,
  LAYER_COLORS,
  OFF_BALANCE,
  PLUMBING_LAYERS,
  SCOPE_SLOPE,
  SOURCE_NOTE,
  SOURCES,
  TRUST_FUNDS,
  familyShares,
  fmtBn,
  fmtTn,
  rankedJctTop10,
  rankedTreasuryHeadlines,
  type ScopeId,
} from "@/data/fiscal-plumbing-research-2026-data";

// viz-types: plumbing pie, trust depletion dual-line, off-balance scatter, ranked lollipop, family bars, cumulative area | layout: canvas

type Panel = "map" | "trusts" | "offBalance" | "rank" | "families" | "cumulative";

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

function TnTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold text-slate-800">{label}</p>}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600">
          {p.name}: {fmtTn(Number(p.value) || 0)}
        </p>
      ))}
    </div>
  );
}

export function FiscalPlumbingResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("map");
  const [scope, setScope] = useState<ScopeId>("jct");
  const [trustView, setTrustView] = useState<"path" | "table">("path");
  const [leverFilter, setLeverFilter] = useState<"all" | "housing-credit" | "other">("all");

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

  const pieData = useMemo(
    () =>
      PLUMBING_LAYERS.map((l) => ({
        name: l.label,
        value: l.bn,
        fill: LAYER_COLORS[l.id] || "#64748b",
      })),
    [],
  );

  const scatterData = useMemo(() => {
    const rows = OFF_BALANCE.filter((r) => {
      if (leverFilter === "all") return true;
      if (leverFilter === "housing-credit") return r.lever === "housing-credit";
      return r.lever !== "housing-credit";
    });
    return rows.map((r) => ({
      ...r,
      x: r.budgetVisibility,
      y: r.policyLeverage,
      z: r.stockTn * 40,
    }));
  }, [leverFilter]);

  const cumulative = useMemo(
    () =>
      rankedJctTop10().reduce<{ n: number; label: string; cumulativeBn: number }[]>(
        (acc, row, i) => {
          const prev = acc[i - 1]?.cumulativeBn || 0;
          acc.push({
            n: i + 1,
            label: `Top ${i + 1}`,
            cumulativeBn: prev + row.fy2026Bn,
          });
          return acc;
        },
        [],
      ),
    [],
  );

  return (
    <div className="space-y-6" data-viz="fiscal-plumbing-research-2026" data-viz-dashboard>
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
          Fiscal plumbing — trust funds · tax code · off-balance credit
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtTn(HEADLINE.jctFy2026Tn)} tax expenditures · OASDI empties ~{HEADLINE.oasdiDepletionYear} ·{" "}
          {fmtTn(HEADLINE.gseStockTn)} GSE MBS
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          The discretionary fight is ~{fmtBn(1700)}. The levers that actually move housing credit, retirement
          income, and health financing sit in trust funds, the tax code, and guarantee books — with{" "}
          {fmtTn(HEADLINE.offBalanceStockTn)}+ of off-balance stock in this map alone.
        </p>
        <p className="mt-3 text-xs text-slate-400">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "map", label: "Plumbing map" },
            { id: "trusts", label: "Trust funds" },
            { id: "offBalance", label: "Off-balance" },
            { id: "rank", label: "Tax-exp rank" },
            { id: "families", label: "By family" },
            { id: "cumulative", label: "Top-N build-up" },
          ]}
        />
        {(panel === "rank" || panel === "families") && (
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
        {panel === "trusts" && (
          <ToggleGroup
            label="View"
            value={trustView}
            onChange={setTrustView}
            options={[
              { id: "path", label: "Depletion path" },
              { id: "table", label: "Fund cards" },
            ]}
          />
        )}
        {panel === "offBalance" && (
          <ToggleGroup
            label="Lever"
            value={leverFilter}
            onChange={setLeverFilter}
            options={[
              { id: "all", label: "All vehicles" },
              { id: "housing-credit", label: "Housing credit" },
              { id: "other", label: "Non-housing" },
            ]}
          />
        )}
      </div>

      {panel === "map" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Where the real annual levers sit"
            subtitle="Editorial pie of FY-scale blocks — not a unified CBO score sheet. Tax code ≈ Social Security."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<BnTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              {PLUMBING_LAYERS.map((l) => (
                <li key={l.id} className="flex items-start gap-2">
                  <span
                    className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: LAYER_COLORS[l.id] }}
                  />
                  <span>
                    <span className="font-semibold text-slate-800">{l.label}</span> — {fmtBn(l.bn)}.{" "}
                    {l.shareHint}
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard
            title="Treasury ↔ JCT packaging gaps"
            subtitle="Same economic ideas, different table designs — why rankings disagree."
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
        </div>
      )}

      {panel === "trusts" && trustView === "path" && (
        <ChartCard
          title="Trust-fund reserve runoff (illustrative)"
          subtitle={`OASDI combined depletes ~${HEADLINE.oasdiDepletionYear}; Medicare HI ~${HEADLINE.hiDepletionYear}. Path is rounded Trustees framing, not a live score.`}
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEPLETION_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis tickFormatter={(v) => `$${v}T`} stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<TnTooltip />} />
                <Line
                  type="monotone"
                  dataKey="oasdiReservesTn"
                  name="OASDI reserves"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="hiReservesTn"
                  name="HI reserves"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "trusts" && trustView === "table" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_FUNDS.filter((t) => t.id !== "oasdi").map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t.shortLabel}
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">{t.label}</p>
              <p className="mt-3 text-sm text-slate-600">
                Reserves ~{fmtTn(t.reservesTn)} · Cost ~{fmtBn(t.annualCostBn)}/yr
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {t.depletionYear
                  ? `Depletion ~${t.depletionYear}`
                  : "Adequately financed (premiums + general revenue)"}
              </p>
            </div>
          ))}
        </div>
      )}

      {panel === "offBalance" && (
        <ChartCard
          title="Off-balance vehicles: visibility vs leverage"
          subtitle="X = budget-visibility score (editorial 0–100). Y = policy leverage. Bubble = stock size ($T)."
        >
          <div className="h-96 min-h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Budget visibility"
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: "Budget visibility →", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Policy leverage"
                  domain={[40, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: "Leverage", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as (typeof scatterData)[0];
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">{d.label}</p>
                        <p className="text-slate-600">Stock ~{fmtTn(d.stockTn)}</p>
                        <p className="text-slate-600">
                          Visibility {d.budgetVisibility} · Leverage {d.policyLeverage}
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Vehicles" data={scatterData} fill="#0ea5e9">
                  {scatterData.map((d) => (
                    <Cell
                      key={d.id}
                      fill={d.lever === "housing-credit" ? "#f59e0b" : "#0ea5e9"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            High-leverage / low-visibility quadrant is the plumbing thesis: GSEs and deposit insurance steer
            more credit than annual appropriation debates admit.
          </p>
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
          title="Tax-expenditure composition by policy family"
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

      {panel === "cumulative" && (
        <ChartCard
          title="How fast the top-N stack reaches ~⅔ of JCT cost"
          subtitle="Running sum of JCT top 10 (still not a joint repeal score). Area = cumulative $."
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulative} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
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

      <p className="text-xs text-slate-500">Sources: {SOURCES.join(" · ")}</p>
    </div>
  );
}
