"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COMPANY_COLORS,
  GS_GI_LAYERS,
  HEADLINE,
  HYPERSCALERS,
  MCKINSEY_SCENARIOS,
  RESEARCH_SCENARIOS,
  SOURCE_NOTE,
  SOURCES,
  YEAR_CONFIDENCE,
  companySeries,
  fmtBn,
  fmtTn,
  scenarioValue,
  type CapexYear,
} from "@/data/ai-capex-spend-research-2026-data";

type FocusYear = "2026" | "2027" | "2028";

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

export function AiCapexSpendResearchDashboard() {
  const [focusYear, setFocusYear] = useState<FocusYear>("2026");
  const [aiOnly, setAiOnly] = useState(false);
  const [mckMetric, setMckMetric] = useState<"aiCapexTn" | "totalCapexTn" | "incrementalGw">(
    "aiCapexTn",
  );

  const stacked = useMemo(() => companySeries(aiOnly), [aiOnly]);

  const pieData = useMemo(() => {
    const year = focusYear as CapexYear;
    const row = stacked.find((r) => r.year === year);
    if (!row) return [];
    return HYPERSCALERS.map((c) => ({
      name: c,
      value: Number(row[c] ?? 0),
      fill: COMPANY_COLORS[c],
    }));
  }, [stacked, focusYear]);

  const fanRows = useMemo(() => {
    return RESEARCH_SCENARIOS.map((s) => {
      const v = scenarioValue(s, focusYear);
      return {
        house: s.house,
        value: v,
        color: s.color,
        scope: s.scope,
        missing: v == null,
      };
    })
      .filter((r) => !r.missing)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }, [focusYear]);

  const composed = useMemo(() => {
    return GS_GI_LAYERS.filter((r) => Number(r.year) <= 2028).map((r) => {
      const hypRow = stacked.find((s) => s.year === r.year);
      return {
        year: r.year,
        gsGiTotal: r.total,
        hyperscaler: hypRow ? Number(hypRow.total) : null,
      };
    });
  }, [stacked]);

  const mckBars = useMemo(
    () =>
      MCKINSEY_SCENARIOS.map((s) => ({
        label: s.label,
        value: s[mckMetric],
        color: s.color,
      })),
    [mckMetric],
  );

  const big5Focus = stacked.find((r) => r.year === focusYear);
  const big5Total = big5Focus ? Number(big5Focus.total) : 0;

  return (
    <div className="space-y-6" data-viz="ai-capex-spend-research">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        Multi-source spend map — company guidance, research-house annual scenarios, and McKinsey
        cumulative frameworks. Scopes differ; do not mix hyperscaler gross with all-in AI
        infrastructure. Primary:{" "}
        <a
          href={SOURCES[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          GS Tracking Trillions
        </a>
        .
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Focus year"
          value={focusYear}
          options={[
            { id: "2026", label: "2026" },
            { id: "2027", label: "2027" },
            { id: "2028", label: "2028" },
          ]}
          onChange={setFocusYear}
        />
        <ToggleGroup
          label="Hyperscaler scope"
          value={aiOnly ? "ai" : "gross"}
          options={[
            { id: "gross", label: "Gross capex" },
            { id: "ai", label: "AI-attributed (~75%)" },
          ]}
          onChange={(v) => setAiOnly(v === "ai")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Big-5 {focusYear} ({aiOnly ? "AI-attributed" : "gross"}) ·{" "}
            {YEAR_CONFIDENCE[focusYear as CapexYear]}
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{fmtBn(big5Total)}</p>
          <p className="mt-2 text-sm text-slate-600">
            Guidance / consensus sum across Amazon, Microsoft, Alphabet, Meta, and Oracle.
            CreditSights post-earnings aggregate sits near {fmtBn(HEADLINE.creditsights_2026)} for
            2026.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            GS IR 2027 base
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{fmtBn(HEADLINE.gsIr_2027_base)}</p>
          <p className="mt-1 text-xs text-slate-400">
            Bull {fmtBn(HEADLINE.gsIr_2027_bull)} · Street ~{fmtBn(HEADLINE.street_2027)}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            McKinsey base (cumul.)
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-950">
            {fmtTn(HEADLINE.mckinsey_base_ai_tn)} AI
          </p>
          <p className="mt-1 text-xs text-amber-900">
            {fmtTn(HEADLINE.mckinsey_total_base_tn)} total DC · GS GI path{" "}
            {fmtTn(HEADLINE.gsGi_cumulative_tn)} (2026–31)
          </p>
        </div>
      </div>

      <ChartCard
        title="Big-5 hyperscaler capex stack, 2024–2028"
        subtitle={
          aiOnly
            ? "AI-attributed ≈75% of gross company capex (CreditSights factor). 2027–28 are directional."
            : "Gross company capex. 2026 = guidance midpoints; 2027–28 = consensus / projected."
        }
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
              <Legend />
              {HYPERSCALERS.map((c) => (
                <Area
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stackId="1"
                  stroke={COMPANY_COLORS[c]}
                  fill={COMPANY_COLORS[c]}
                  fillOpacity={0.75}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={`Research-house scenario fan — ${focusYear}`}
          subtitle="Annual USD billions. Different scopes: all-in AI infra vs hyperscaler gross."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fanRows}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="house"
                  width={148}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => [
                    fmtBn(Number(v ?? 0)),
                    (item?.payload as { scope?: string })?.scope ?? "Spend",
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Annual spend">
                  {fanRows.map((r) => (
                    <Cell key={r.house} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={`${focusYear} company mix`}
          subtitle={aiOnly ? "AI-attributed share of Big-5 total" : "Gross share of Big-5 total"}
        >
          <div className="h-80 w-full min-w-0">
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
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="All-in GS GI path vs Big-5 hyperscaler stack"
        subtitle="GS Global Institute = global AI infra layers. Hyperscaler line follows the scope toggle above."
      >
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={composed} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
              <Legend />
              <Bar dataKey="gsGiTotal" fill="#06b6d4" name="GS GI all-in AI infra" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="hyperscaler"
                stroke="#0f172a"
                strokeWidth={2.5}
                name={aiOnly ? "Big-5 AI-attributed" : "Big-5 gross"}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="McKinsey cumulative data-center scenarios (to 2030)"
        subtitle="Multi-year totals — not annual run-rates. Toggle metric below."
      >
        <div className="mb-4">
          <ToggleGroup
            label="Metric"
            value={mckMetric}
            options={[
              { id: "aiCapexTn", label: "AI capex ($T)" },
              { id: "totalCapexTn", label: "Total DC ($T)" },
              { id: "incrementalGw", label: "Incremental GW" },
            ]}
            onChange={setMckMetric}
          />
        </div>
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mckBars} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  mckMetric === "incrementalGw" ? `${v} GW` : `$${v}T`
                }
              />
              <Tooltip
                formatter={(v) =>
                  mckMetric === "incrementalGw"
                    ? `${Number(v ?? 0)} GW`
                    : fmtTn(Number(v ?? 0))
                }
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Scenario">
                {mckBars.map((r) => (
                  <Cell key={r.label} fill={r.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
