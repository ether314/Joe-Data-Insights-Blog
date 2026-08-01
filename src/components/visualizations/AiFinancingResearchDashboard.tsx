"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  ETF_CHANNELS,
  FINANCING_PATH,
  HEADLINE,
  ISSUER_COLORS,
  MAJOR_DEALS,
  SOURCE_NOTE,
  SOURCES,
  SPREAD_TENORS,
  fmtBn,
  fmtPct,
  fundingMixForYear,
} from "@/data/ai-financing-research-2026-data";

type FocusYear = 2025 | 2026 | 2027;
type MarketLens = "credit" | "funding" | "equity";

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

function ToggleGroup<T extends string | number>({
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
            key={String(o.id)}
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

export function AiFinancingResearchDashboard() {
  const [focusYear, setFocusYear] = useState<FocusYear>(2026);
  const [lens, setLens] = useState<MarketLens>("credit");

  const pathRow = FINANCING_PATH.find((r) => r.year === focusYear);

  const composed = useMemo(
    () =>
      FINANCING_PATH.map((r) => ({
        year: String(r.year),
        bonds: r.igBondIssuanceBn,
        debtShare: r.debtShareOfCapexPct,
        capex: r.capexBn,
        isForecast: r.confidence === "forecast",
      })),
    [],
  );

  const mix = useMemo(() => fundingMixForYear(focusYear), [focusYear]);

  const deals = useMemo(() => {
    const filtered =
      lens === "equity"
        ? MAJOR_DEALS.filter((d) => d.type === "Equity" || d.amountBn >= 25)
        : MAJOR_DEALS.filter((d) => d.type === "IG bond");
    return filtered
      .map((d) => ({
        name: `${d.issuer} · ${d.month}`,
        amount: d.amountBn,
        fill: ISSUER_COLORS[d.issuer] ?? "#64748b",
        type: d.type,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [lens]);

  const spreads = useMemo(
    () =>
      SPREAD_TENORS.map((s) => ({
        tenor: s.tenor,
        "2025": s.spread2025Bps,
        "2026": s.spread2026Bps,
        delta: s.spread2026Bps - s.spread2025Bps,
      })),
    [],
  );

  const etfBars = useMemo(
    () =>
      ETF_CHANNELS.map((e) => ({
        ticker: e.ticker,
        flows: e.flows2025Bn,
        fill: e.color,
        name: e.name,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-financing-research-2026">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        {SOURCE_NOTE} Primary synthesis:{" "}
        <a
          href={SOURCES[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          Goldman debt-share path
        </a>
        .
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Focus year"
          value={focusYear}
          options={[
            { id: 2025 as FocusYear, label: "2025" },
            { id: 2026 as FocusYear, label: "2026" },
            { id: 2027 as FocusYear, label: "2027" },
          ]}
          onChange={setFocusYear}
        />
        <ToggleGroup
          label="Market lens"
          value={lens}
          options={[
            { id: "credit" as MarketLens, label: "IG credit" },
            { id: "funding" as MarketLens, label: "Funding mix" },
            { id: "equity" as MarketLens, label: "Equity / ETFs" },
          ]}
          onChange={setLens}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Headline · {focusYear} debt share of capex
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {fmtPct(pathRow?.debtShareOfCapexPct ?? HEADLINE.debtShare2026Pct)} via IG bonds
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Goldman path: {fmtBn(pathRow?.igBondIssuanceBn ?? HEADLINE.igBonds2026Bn)} of IG
            issuance against {fmtBn(pathRow?.capexBn ?? HEADLINE.capex2026Bn)} hyperscaler capex
            {focusYear === 2026
              ? ` — YTD prints already ~${fmtBn(HEADLINE.ytd2026Bn)} by early July.`
              : "."}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            2027 IG forecast
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{fmtBn(HEADLINE.igBonds2027Bn)}</p>
          <p className="mt-1 text-xs text-slate-400">
            ~{fmtPct(HEADLINE.debtShare2027Pct)} of ~{fmtBn(1140)} capex
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Cash vs spend (2026)
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-950">
            {fmtBn(HEADLINE.ocf2026Bn)} OCF
          </p>
          <p className="mt-1 text-xs text-amber-900">
            vs {fmtBn(HEADLINE.capex2026Bn)} capex — buffer vanishes after buybacks
          </p>
        </div>
      </div>

      <ChartCard
        title="Hyperscaler IG bond issuance vs debt share of capex"
        subtitle="Bars = global IG-rated bond issuance ($B). Line = debt-funded share of company capex (%). 2026–27 are Goldman forecasts."
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={composed} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tickFormatter={(v) => `$${v}B`}
                tick={{ fontSize: 11 }}
                width={52}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `${v}%`}
                domain={[0, 40]}
                tick={{ fontSize: 11 }}
                width={40}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                      <p className="mb-1 font-semibold text-slate-800">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} style={{ color: p.color }}>
                          {p.name}:{" "}
                          {p.dataKey === "debtShare"
                            ? fmtPct(Number(p.value ?? 0))
                            : fmtBn(Number(p.value ?? 0))}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="bonds"
                name="IG bond issuance"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="debtShare"
                name="Debt share of capex"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {lens === "funding" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`Funding mix — ${focusYear}`}
            subtitle="Illustrative share of hyperscaler AI infrastructure spend by channel. OCF still leads; IG bonds take a rising third."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mix}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${String(name).split(" ")[0]} ${value}%`}
                  >
                    {mix.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Channel shares across years"
            subtitle="Toggle focus year above. Structured / private-credit channels re-expand as IG supply saturates."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mix} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 70]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {mix.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {lens === "credit" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Major disclosed financings"
            subtitle="Largest IG deals in the 2025–26 wave. Four of five biggest US IG deals in 2H 2025 were hyperscalers (MUFG)."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deals} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {deals.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="New-issue credit spreads — 2025 vs 2026"
            subtitle="Median spreads for Amazon, Alphabet, Meta, Oracle. Supply is absorbing demand — investors demand more concession."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spreads} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="tenor" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${v}bp`} tick={{ fontSize: 11 }} domain={[0, 140]} />
                  <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(1)} bp`} />
                  <Legend />
                  <Line type="monotone" dataKey="2025" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="2026" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {lens === "equity" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Public equity / ETF flows into the AI trade (2025)"
            subtitle="Investors still fund the equity side via QQQ more than niche AI ETFs — while issuers tap primary equity (Alphabet) when debt books fill."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={etfBars} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="ticker" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => fmtBn(Number(v ?? 0))}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as { name?: string } | undefined;
                      return row?.name ?? "";
                    }}
                  />
                  <Bar dataKey="flows" radius={[4, 4, 0, 0]}>
                    {etfBars.map((e) => (
                      <Cell key={e.ticker} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Largest primary equity + mega bond prints"
            subtitle={`Alphabet’s ${fmtBn(HEADLINE.alphabetEquityBn)} June 2026 equity raise sits beside the bond wave — equity is back in the funding mix.`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deals} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {deals.map((d) => (
                      <Cell key={d.name} fill={d.type === "Equity" ? "#8b5cf6" : d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline underline-offset-2"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
