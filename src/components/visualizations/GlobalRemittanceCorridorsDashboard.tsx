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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BILATERAL_CORRIDORS,
  CORRIDOR_COLORS,
  EXTERNAL_FLOWS_2024,
  GDP_DEPENDENCE_LEADERS,
  HEADLINE,
  RECIPIENT_COLORS,
  REGIONAL_GROWTH_2024,
  REGIONAL_HISTORY,
  REGION_COLORS,
  SOURCE_NOTE,
  SOURCES,
  TOP_RECIPIENTS_2024,
  fmtBn,
  fmtPct,
} from "@/data/global-remittance-corridors-data";

// viz-types: horizontal-bar, stacked-area, scatter, dumbbell, grouped-bar | layout: default

type MainTab = "recipients" | "corridors" | "gdp";
type GdpView = "leaders" | "scatter";
type CorridorFilter = "all" | "us" | "gulf";

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
              value === o.id ? "bg-amber-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GlobalRemittanceCorridorsDashboard() {
  const [tab, setTab] = useState<MainTab>("corridors");
  const [gdpView, setGdpView] = useState<GdpView>("leaders");
  const [corridorFilter, setCorridorFilter] = useState<CorridorFilter>("all");

  const recipients = useMemo(
    () =>
      [...TOP_RECIPIENTS_2024]
        .sort((a, b) => b.inflowBn - a.inflowBn)
        .map((r) => ({
          ...r,
          label: r.country,
          fill: RECIPIENT_COLORS[r.country] ?? "#94a3b8",
        })),
    [],
  );

  const regionalStack = useMemo(
    () =>
      REGIONAL_HISTORY.map((y) => ({
        year: y.year,
        "South Asia": y.southAsia,
        "East Asia & Pacific": y.eastAsiaPacific,
        "Europe & Central Asia": y.europeCentralAsia,
        "Latin America & Caribbean": y.latinAmericaCaribbean,
        "Middle East & N. Africa": y.middleEastNorthAfrica,
        "Sub-Saharan Africa": y.subSaharanAfrica,
      })),
    [],
  );

  const corridors = useMemo(() => {
    const filtered = BILATERAL_CORRIDORS.filter((c) => {
      if (corridorFilter === "us") return c.sourceIso === "US";
      if (corridorFilter === "gulf") return c.sourceIso === "AE" || c.sourceIso === "SA";
      return true;
    });
    return [...filtered]
      .sort((a, b) => b.flowBn - a.flowBn)
      .map((c) => ({
        ...c,
        label: `${c.source} → ${c.destination}`,
        fill: CORRIDOR_COLORS[c.id] ?? "#94a3b8",
      }));
  }, [corridorFilter]);

  const gdpLeaders = useMemo(
    () =>
      [...GDP_DEPENDENCE_LEADERS]
        .sort((a, b) => b.remittanceShareOfGdpPct - a.remittanceShareOfGdpPct)
        .map((g) => ({
          ...g,
          label: g.country,
        })),
    [],
  );

  const scatterPoints = useMemo(
    () =>
      TOP_RECIPIENTS_2024.map((r) => {
        const dep = GDP_DEPENDENCE_LEADERS.find((g) => g.iso === r.iso);
        return {
          country: r.country,
          inflowBn: r.inflowBn,
          gdpSharePct: dep?.remittanceShareOfGdpPct ?? 3,
          size: Math.max(80, r.inflowBn * 2),
          fill: RECIPIENT_COLORS[r.country] ?? "#94a3b8",
          isTopRecipient: true,
        };
      }).concat(
        GDP_DEPENDENCE_LEADERS.filter(
          (g) => !TOP_RECIPIENTS_2024.some((r) => r.iso === g.iso),
        ).map((g) => ({
          country: g.country,
          inflowBn: 8,
          gdpSharePct: g.remittanceShareOfGdpPct,
          size: Math.max(60, g.remittanceShareOfGdpPct * 3),
          fill: "#64748b",
          isTopRecipient: false,
        })),
      ),
    [],
  );

  const dumbbellRows = useMemo(
    () =>
      [...REGIONAL_GROWTH_2024]
        .sort((a, b) => b.growthPct2024 - a.growthPct2024)
        .map((r) => ({
          region: r.region,
          growth2023: r.growthPct2023,
          growth2024: r.growthPct2024,
        })),
    [],
  );

  const externalFlows = useMemo(
    () => [...EXTERNAL_FLOWS_2024].sort((a, b) => b.amountBn - a.amountBn),
    [],
  );

  const EXTERNAL_COLORS: Record<string, string> = {
    Remittances: "#f59e0b",
    FDI: "#0ea5e9",
    ODA: "#8b5cf6",
  };

  return (
    <div className="space-y-6" data-viz="global-remittance-corridors">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Top corridor · KNOMAD 2021 estimate
        </p>
        <p className="mt-1 text-3xl font-bold text-slate-900">
          US → Mexico {fmtBn(HEADLINE.usMexicoCorridorBn)} — the largest bilateral pipe
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Country totals tell a different story: India takes {fmtBn(HEADLINE.indiaInflowBn)} of{" "}
          {fmtBn(HEADLINE.lmicTotalBn)} LMIC inflows in 2024 (+{fmtPct(HEADLINE.growthPct2024)} after{" "}
          {fmtPct(HEADLINE.growthPct2023)} in 2023). UAE → India ({fmtBn(HEADLINE.uaeIndiaCorridorBn)}) is the
          second-largest modeled corridor.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ToggleGroup<MainTab>
          label="View"
          value={tab}
          options={[
            { id: "corridors", label: "Corridors" },
            { id: "recipients", label: "Recipients" },
            { id: "gdp", label: "GDP dependence" },
          ]}
          onChange={setTab}
        />
        {tab === "corridors" && (
          <ToggleGroup<CorridorFilter>
            label="Source filter"
            value={corridorFilter}
            options={[
              { id: "all", label: "All sources" },
              { id: "us", label: "US only" },
              { id: "gulf", label: "Gulf only" },
            ]}
            onChange={setCorridorFilter}
          />
        )}
        {tab === "gdp" && (
          <ToggleGroup<GdpView>
            label="GDP lens"
            value={gdpView}
            options={[
              { id: "leaders", label: "Share leaders" },
              { id: "scatter", label: "Volume vs dependence" },
            ]}
            onChange={setGdpView}
          />
        )}
      </div>

      {tab === "recipients" && (
        <ChartCard
          title="Top LMIC remittance recipients, 2024"
          subtitle="World Bank disclosed estimates — inflows in current USD billions"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recipients}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="label" width={88} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v ?? 0))}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="inflowBn" name="Inflow" radius={[0, 4, 4, 0]}>
                  {recipients.map((r) => (
                    <Cell key={r.iso} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            India = {fmtPct(recipients[0]?.shareOfLmicPct ?? 0)} of all LMIC remittances. Confidence: disclosed
            (Brief 41).
          </p>
        </ChartCard>
      )}

      {tab === "corridors" && (
        <ChartCard
          title="Estimated bilateral corridors (KNOMAD 2021)"
          subtitle="Model-based splits — not official bilateral transaction data"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={corridors}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v ?? 0), 1)}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="flowBn" name="Estimated flow" radius={[0, 4, 4, 0]}>
                  {corridors.map((c) => (
                    <Cell key={c.id} fill={c.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            US→Mexico at {fmtBn(HEADLINE.usMexicoCorridorBn)} remains the largest KNOMAD corridor. UAE→India (
            {fmtBn(HEADLINE.uaeIndiaCorridorBn)}) and Saudi→India flows are Gulf-skewed; US→India KNOMAD estimate
            understates recent US share shifts per RBI source-mix data.
          </p>
        </ChartCard>
      )}

      {tab === "gdp" && gdpView === "leaders" && (
        <ChartCard
          title="Remittance share of GDP — global leaders"
          subtitle="Brief 41 — dependence can exceed 40% of national output"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gdpLeaders}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 50]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis type="category" dataKey="label" width={88} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmtPct(Number(v ?? 0), 0)} />
                <Bar dataKey="remittanceShareOfGdpPct" name="Share of GDP" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "gdp" && gdpView === "scatter" && (
        <ChartCard
          title="Dollar volume vs GDP dependence"
          subtitle="Top recipients (colored) vs high-dependence smaller economies (gray)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="inflowBn"
                  name="Inflow"
                  tickFormatter={(v) => `$${v}B`}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Inflow ($B)", position: "insideBottom", offset: -4, style: { fontSize: 11 } }}
                />
                <YAxis
                  type="number"
                  dataKey="gdpSharePct"
                  name="GDP share"
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                  label={{ value: "% of GDP", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <ZAxis type="number" dataKey="size" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as {
                      country: string;
                      inflowBn: number;
                      gdpSharePct: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
                        <p className="font-semibold text-slate-900">{d.country}</p>
                        <p className="text-sm text-slate-600">Inflow: {fmtBn(d.inflowBn)}</p>
                        <p className="text-sm text-slate-600">GDP share: {fmtPct(d.gdpSharePct, 0)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterPoints} fill="#94a3b8">
                  {scatterPoints.map((p) => (
                    <Cell key={p.country} fill={p.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <ChartCard
        title="Remittances vs FDI and ODA to LMICs, 2024"
        subtitle="Officially recorded remittances exceed FDI and more than triple ODA"
      >
        <div className="h-56 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={externalFlows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
              <Bar dataKey="amountBn" name="USD billions" radius={[4, 4, 0, 0]}>
                {externalFlows.map((f) => (
                  <Cell key={f.label} fill={EXTERNAL_COLORS[f.label] ?? "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="LMIC remittance inflows by region, 2019–2024"
        subtitle="Stacked regional totals — 2024 regional splits estimated to match $685B headline"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={regionalStack} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="South Asia"
                stackId="1"
                fill={REGION_COLORS.southAsia}
                stroke={REGION_COLORS.southAsia}
              />
              <Area
                type="monotone"
                dataKey="East Asia & Pacific"
                stackId="1"
                fill={REGION_COLORS.eastAsiaPacific}
                stroke={REGION_COLORS.eastAsiaPacific}
              />
              <Area
                type="monotone"
                dataKey="Europe & Central Asia"
                stackId="1"
                fill={REGION_COLORS.europeCentralAsia}
                stroke={REGION_COLORS.europeCentralAsia}
              />
              <Area
                type="monotone"
                dataKey="Latin America & Caribbean"
                stackId="1"
                fill={REGION_COLORS.latinAmericaCaribbean}
                stroke={REGION_COLORS.latinAmericaCaribbean}
              />
              <Area
                type="monotone"
                dataKey="Middle East & N. Africa"
                stackId="1"
                fill={REGION_COLORS.middleEastNorthAfrica}
                stroke={REGION_COLORS.middleEastNorthAfrica}
              />
              <Area
                type="monotone"
                dataKey="Sub-Saharan Africa"
                stackId="1"
                fill={REGION_COLORS.subSaharanAfrica}
                stroke={REGION_COLORS.subSaharanAfrica}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Regional growth rates — 2023 vs 2024"
        subtitle="Dumbbell view: South Asia led at 11.8% in 2024"
      >
        <div className="space-y-3">
          {dumbbellRows.map((row) => {
            const minG = Math.min(row.growth2023, row.growth2024, 0);
            const maxG = Math.max(row.growth2023, row.growth2024, 12);
            const span = maxG - minG || 1;
            const toPct = (g: number) => `${((g - minG) / span) * 92}%`;
            const left = Math.min(row.growth2023, row.growth2024);
            const right = Math.max(row.growth2023, row.growth2024);
            return (
              <div key={row.region} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{row.region}</p>
                  <div className="relative mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-amber-300"
                      style={{
                        left: toPct(left),
                        width: `${Math.max(2, ((right - left) / span) * 92)}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-400"
                      style={{ left: toPct(row.growth2023) }}
                      title={`2023: ${fmtPct(row.growth2023)}`}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow"
                      style={{ left: toPct(row.growth2024) }}
                      title={`2024: ${fmtPct(row.growth2024)}`}
                    />
                  </div>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <span className="text-slate-400">{fmtPct(row.growth2023)}</span>
                  <span className="mx-1">→</span>
                  <span className="font-semibold text-amber-700">{fmtPct(row.growth2024)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Gray dot = 2023 regional growth. Amber dot = 2024 regional estimate from Brief 41. South Asia
          reaccelerated from {fmtPct(5.2)} to {fmtPct(HEADLINE.southAsiaGrowthPct2024)}.
        </p>
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 space-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-amber-800 underline hover:text-amber-900" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
