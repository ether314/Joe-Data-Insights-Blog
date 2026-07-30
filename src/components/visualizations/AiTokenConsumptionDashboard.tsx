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
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BRAND_COLORS,
  BRAND_IDS,
  BRAND_LABELS,
  BRAND_ORIGIN,
  CHINA_APP_MAU,
  CHINA_MAAS_ECONOMICS,
  CHINA_NATIONAL_DAILY,
  IDC_EXTERNAL_MAAS,
  DATA_MONTH_END,
  DATA_MONTH_START,
  GLOBAL_SUMMARY,
  JUNE_2026_SLICE,
  METHOD_NOTES,
  OPENROUTER_SPLIT,
  OPENROUTER_TOP_MODELS,
  ORIGIN_COLORS,
  ORIGIN_TREND,
  ORIGINS,
  OPENROUTER_AUDIENCE,
  PRICE_PER_MTOK,
  PRICE_REVERSALS,
  SOURCE_NOTE,
  STATS,
  TOKEN_MONTHLY,
  fmtPct,
  fmtShare,
  fmtTokensT,
  type AiBrandId,
  type Origin,
  type TokenMonthlyRecord,
} from "@/data/ai-token-consumption-data";

type BrandFilter = AiBrandId | "All";
type OriginFilter = Origin | "All";

const TOP_BRANDS: AiBrandId[] = ["bytedance", "google", "openai", "alibaba", "deepseek"];

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

function SourcePill({ sourceType }: { sourceType: TokenMonthlyRecord["sourceType"] }) {
  const styles =
    sourceType === "disclosed"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${styles}`}>
      {sourceType === "disclosed" ? "Disclosed" : "Estimated"}
    </span>
  );
}

function OriginPill({ origin }: { origin: Origin }) {
  return (
    <span
      className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
      style={{ backgroundColor: ORIGIN_COLORS[origin] }}
    >
      {origin === "United States" ? "US" : origin}
    </span>
  );
}

function fmtMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} '${y.slice(2)}`;
}

export function AiTokenConsumptionDashboard() {
  const [brand, setBrand] = useState<BrandFilter>("All");
  const [origin, setOrigin] = useState<OriginFilter>("All");

  const originTrend = useMemo(
    () =>
      ORIGIN_TREND.map((r) => ({
        month: fmtMonthLabel(r.yearMonth),
        yearMonth: r.yearMonth,
        "United States": Number(r["United States"]),
        China: Number(r["China"]),
        Europe: Number(r["Europe"]),
        Canada: Number(r["Canada"]),
        total: r.total,
      })),
    [],
  );

  const crossoverLabel = GLOBAL_SUMMARY.crossoverMonth
    ? fmtMonthLabel(GLOBAL_SUMMARY.crossoverMonth)
    : null;

  const brandTrend = useMemo(
    () =>
      ORIGIN_TREND.map((r) => {
        const row: Record<string, string | number> = {
          month: fmtMonthLabel(r.yearMonth),
          yearMonth: r.yearMonth,
        };
        for (const brandId of TOP_BRANDS) {
          const rec = TOKEN_MONTHLY.find(
            (x) => x.brandId === brandId && x.yearMonth === r.yearMonth,
          );
          row[brandId] = rec?.tokensTrillions ?? 0;
        }
        return row;
      }),
    [],
  );

  const june2026Comparison = useMemo(
    () =>
      [...JUNE_2026_SLICE]
        .sort((a, b) => b.tokensTrillions - a.tokensTrillions)
        .map((r) => ({
          name: r.brand,
          tokens: r.tokensTrillions,
          origin: r.origin,
          fill: ORIGIN_COLORS[r.origin],
        })),
    [],
  );

  const routerSplit = useMemo(
    () =>
      OPENROUTER_SPLIT.map((r) => ({
        label: r.label,
        China: r.chinaPct,
        "United States": r.usPct,
        note: r.note,
      })),
    [],
  );

  const priceChart = useMemo(
    () =>
      [...PRICE_PER_MTOK]
        .sort((a, b) => b.usdPerMTokIn - a.usdPerMTokIn)
        .map((p) => ({
          name: p.model,
          price: p.usdPerMTokIn,
          output: p.usdPerMTokOut,
          fill: ORIGIN_COLORS[p.origin],
        })),
    [],
  );

  const nationalChart = useMemo(
    () =>
      CHINA_NATIONAL_DAILY.map((r) => ({
        label: fmtMonthLabel(r.yearMonth),
        perDay: r.tokensTrillionsPerDay,
      })),
    [],
  );

  const filtered = useMemo(() => {
    let rows = TOKEN_MONTHLY;
    if (origin !== "All") rows = rows.filter((r) => r.origin === origin);
    if (brand !== "All") rows = rows.filter((r) => r.brandId === brand);
    return rows;
  }, [brand, origin]);

  const brandOptions = useMemo(
    () => (origin === "All" ? BRAND_IDS : BRAND_IDS.filter((id) => BRAND_ORIGIN[id] === origin)),
    [origin],
  );

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200";

  return (
    <div className="site-content w-full min-w-0 space-y-6" data-viz="ai-token-consumption">
      <p className="text-sm text-slate-400">
        {STATS.recordCount} monthly records · {STATS.brandCount} providers (
        {GLOBAL_SUMMARY.usBrandCount} US, {GLOBAL_SUMMARY.chinaBrandCount} China) ·{" "}
        {DATA_MONTH_START} – {DATA_MONTH_END} · {SOURCE_NOTE}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total tokens (Jun 2026)",
            value: STATS.totalJun2026Label,
            sub: `${fmtPct(GLOBAL_SUMMARY.yoyTotalGrowthPctJun2026)} YoY · ${fmtPct(GLOBAL_SUMMARY.momTotalGrowthPctJun2026)} MoM`,
            color: "#6366f1",
          },
          {
            label: "China share",
            value: STATS.chinaShareLabel,
            sub: `${fmtTokensT(GLOBAL_SUMMARY.chinaTokensJun2026)} across ${GLOBAL_SUMMARY.chinaBrandCount} providers`,
            color: ORIGIN_COLORS.China,
          },
          {
            label: "US share",
            value: STATS.usShareLabel,
            sub: `${fmtTokensT(GLOBAL_SUMMARY.usTokensJun2026)} across ${GLOBAL_SUMMARY.usBrandCount} providers`,
            color: ORIGIN_COLORS["United States"],
          },
          {
            label: "Largest single provider",
            value: fmtTokensT(GLOBAL_SUMMARY.topBrandJun2026.tokensTrillions),
            sub: `${GLOBAL_SUMMARY.topBrandJun2026.brand} — ${fmtShare(GLOBAL_SUMMARY.bytedanceSharePctJun2026)} of tracked volume`,
            color: BRAND_COLORS.bytedance,
          },
          {
            label: "Data coverage",
            value: `${GLOBAL_SUMMARY.disclosedRowCount} disclosed`,
            sub: `${GLOBAL_SUMMARY.estimatedRowCount} estimated rows`,
            color: "#0891b2",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-600">{s.sub}</p>
          </div>
        ))}
      </div>

      <ChartCard
        title="US vs China token volume, Nov 2022 – Jun 2026"
        subtitle={
          crossoverLabel
            ? `Stacked monthly volume by provider origin · China takes a durable lead from ${crossoverLabel}, after a brief DeepSeek R1-driven lead in early 2025`
            : "Stacked monthly volume by provider origin"
        }
      >
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={originTrend} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtTokensT(Number(v))} />
            <Tooltip
              formatter={(v, n) => [fmtTokensT(Number(v ?? 0)), String(n)]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.yearMonth ?? ""}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {GLOBAL_SUMMARY.crossoverMonth && (
              <ReferenceLine
                x={crossoverLabel ?? undefined}
                stroke="#0f172a"
                strokeDasharray="4 4"
                label={{ value: "China > US", fontSize: 10, fill: "#0f172a", position: "top" }}
              />
            )}
            {ORIGINS.map((o) => (
              <Area
                key={o}
                type="monotone"
                dataKey={o}
                stackId="1"
                stroke={ORIGIN_COLORS[o]}
                fill={ORIGIN_COLORS[o]}
                fillOpacity={0.75}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="OpenRouter routed volume: China vs US model share"
          subtitle={`Share of all routed models · ${OPENROUTER_AUDIENCE.usDevelopersPct}% of its developers are American, only ${OPENROUTER_AUDIENCE.chineseDevelopersPct}% Chinese`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={routerSplit} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip
                formatter={(v, n) => [`${Number(v ?? 0).toFixed(1)}%`, String(n)]}
                labelFormatter={(label, payload) =>
                  `${label} — ${payload?.[0]?.payload?.note ?? ""}`
                }
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="China"
                stroke={ORIGIN_COLORS.China}
                strokeWidth={2.5}
                dot
              />
              <Line
                type="monotone"
                dataKey="United States"
                stroke={ORIGIN_COLORS["United States"]}
                strokeWidth={2.5}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Price per million input tokens"
          subtitle="Published list prices, mid-2026 · the cost gap driving the volume shift"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={priceChart}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" width={132} tick={{ fontSize: 9 }} />
              <Tooltip
                formatter={(v, _n, item) => {
                  const out = item?.payload?.output;
                  return [
                    `$${Number(v ?? 0).toFixed(3)} in${out ? ` · $${Number(out).toFixed(2)} out` : ""}`,
                    "Per million tokens",
                  ];
                }}
              />
              <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                {priceChart.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top five providers — monthly trend"
          subtitle="ByteDance, Google, OpenAI, Alibaba, DeepSeek"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={brandTrend} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtTokensT(Number(v))} />
              <Tooltip formatter={(v) => fmtTokensT(Number(v ?? 0))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {TOP_BRANDS.map((id) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  name={BRAND_LABELS[id]}
                  stroke={BRAND_COLORS[id]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="China's official national token volume"
          subtitle="National Data Administration — trillions of tokens called per day"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nationalChart} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}T`} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0)}T tokens/day`, "National total"]} />
              <Bar dataKey="perDay" fill={ORIGIN_COLORS.China} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="June 2026 provider comparison"
        subtitle="Estimated tokens processed per month, coloured by provider origin"
      >
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={june2026Comparison}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtTokensT(Number(v))} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(v) => [fmtTokensT(Number(v ?? 0)), "Tokens"]}
              labelFormatter={(label) => `${label} · Jun 2026`}
            />
            <Bar dataKey="tokens" radius={[0, 4, 4, 0]}>
              {june2026Comparison.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-900">
            Most-used models on OpenRouter
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Trailing month to late July 2026 · routed developer traffic
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Lab</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OPENROUTER_TOP_MODELS.map((m, i) => (
                <tr key={m.model} className="hover:bg-cyan-50/30">
                  <td className="px-4 py-2.5 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{m.model}</td>
                  <td className="px-4 py-2.5 text-slate-600">{m.lab}</td>
                  <td className="px-4 py-2.5">
                    <OriginPill origin={m.origin} />
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-slate-800">
                    {fmtTokensT(m.tokensT)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h3 className="text-lg font-bold text-amber-900">
          Two scopes, two very different numbers
        </h3>
        <p className="mt-1 text-sm text-amber-800">
          Provider headline figures are company-wide inference meters and are not additive. IDC
          measures only what external customers actually pay a cloud to run. The gap between them
          is roughly 30x.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              What companies claim
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {fmtTokensT(GLOBAL_SUMMARY.chinaTokensJun2026)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Sum of Chinese provider headlines, Jun 2026. Includes first-party apps and internal
              traffic; double-counts open weights re-served by other clouds.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              What the market pays for
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {fmtTokensT(IDC_EXTERNAL_MAAS[1].tokensTrillionsPerYear / 12)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              IDC public-cloud MaaS, external customers only —{" "}
              {IDC_EXTERNAL_MAAS[1].tokensTrillionsPerYear}T across all of 2025, monthly average.
            </p>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-900">
          China&rsquo;s entire public-cloud model market earned{" "}
          <strong>RMB {CHINA_MAAS_ECONOMICS.revenueRmbBn}bn (~$
          {CHINA_MAAS_ECONOMICS.revenueUsdM}M)</strong> in {CHINA_MAAS_ECONOMICS.year} on{" "}
          {CHINA_MAAS_ECONOMICS.tokensTrillions}T tokens — a blended{" "}
          <strong>${CHINA_MAAS_ECONOMICS.blendedUsdPerMTok} per million tokens</strong> nationwide.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-bold text-slate-900">
              The Chinese price war is over
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Prices rose across 2026 as supply, not demand, became the constraint
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {PRICE_REVERSALS.map((p) => (
              <li key={p.lab} className="flex gap-3 px-5 py-3">
                <span className="mt-0.5 shrink-0 rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                  {p.change}
                </span>
                <span className="text-sm text-slate-600">
                  <strong className="text-slate-900">{p.lab}</strong> — {p.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-bold text-slate-900">China AI app monthly users</h3>
            <p className="mt-1 text-sm text-slate-500">QuestMobile · June 2026</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[380px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">App</th>
                  <th className="px-5 py-3">Feb 2025</th>
                  <th className="px-5 py-3">Jun 2026</th>
                  <th className="px-5 py-3">YoY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CHINA_APP_MAU.map((m) => (
                  <tr key={m.app} className="hover:bg-cyan-50/30">
                    <td className="px-5 py-2.5 font-semibold text-slate-900">{m.app}</td>
                    <td className="px-5 py-2.5 tabular-nums text-slate-500">
                      {m.feb2025M !== null ? `${m.feb2025M}M` : "—"}
                    </td>
                    <td className="px-5 py-2.5 tabular-nums text-slate-800">{m.jun2026M}M</td>
                    <td
                      className={`px-5 py-2.5 tabular-nums font-medium ${
                        m.yoyPct === null
                          ? "text-slate-400"
                          : m.yoyPct >= 0
                            ? "text-emerald-700"
                            : "text-rose-700"
                      }`}
                    >
                      {fmtPct(m.yoyPct, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="token-origin" className="mb-1 block text-sm font-medium text-slate-700">
            Origin filter
          </label>
          <select
            id="token-origin"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value as OriginFilter);
              setBrand("All");
            }}
            className={`${selectClass} min-w-[180px]`}
          >
            <option value="All">All origins</option>
            {ORIGINS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="token-brand" className="mb-1 block text-sm font-medium text-slate-700">
            Provider filter
          </label>
          <select
            id="token-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value as BrandFilter)}
            className={`${selectClass} min-w-[220px]`}
          >
            <option value="All">All providers</option>
            {brandOptions.map((id) => (
              <option key={id} value={id}>
                {BRAND_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500" id="token-record-count">
        Showing {filtered.length} of {STATS.recordCount} records
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[960px] table-fixed text-[11px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr>
                {["Provider", "Origin", "Month", "Tokens", "MoM", "YoY", "Type", "Source"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-normal break-words px-2 py-2 text-left text-[10px] font-semibold text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/30">
                  <td className="whitespace-normal break-words px-2 py-2 font-semibold text-slate-900">
                    <span
                      className="mr-1.5 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: BRAND_COLORS[r.brandId] }}
                    />
                    {r.brand}
                  </td>
                  <td className="px-2 py-2">
                    <OriginPill origin={r.origin} />
                  </td>
                  <td className="px-2 py-2 text-slate-600">{r.yearMonth}</td>
                  <td className="whitespace-normal break-words px-2 py-2 font-medium text-slate-800">
                    {fmtTokensT(r.tokensTrillions)}
                    {r.notes && (
                      <span className="mt-0.5 block text-[10px] font-normal text-slate-400">
                        {r.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-slate-600">{fmtPct(r.momPct)}</td>
                  <td className="px-2 py-2 text-slate-600">{fmtPct(r.yoyPct)}</td>
                  <td className="px-2 py-2">
                    <SourcePill sourceType={r.sourceType} />
                  </td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-500">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className="rounded border border-sky-200 bg-sky-50 text-xs text-sky-900">
        <summary className="cursor-pointer px-3 py-2 font-semibold text-sky-800">
          Methodology &amp; caveats
        </summary>
        <div className="space-y-2 border-t border-sky-200 px-3 py-2 leading-relaxed text-sky-800">
          <p>
            <strong>Units:</strong> Tokens processed per calendar month, in trillions (T). Values
            above 1,000T display as quadrillions (Q). Series are interpolated geometrically between
            anchor points; rows marked <em>disclosed</em> sit on a published figure.
          </p>
          {METHOD_NOTES.map((note) => (
            <p key={note.slice(0, 32)}>{note}</p>
          ))}
          <p>
            <strong>June 2026 total:</strong> {fmtTokensT(GLOBAL_SUMMARY.totalTokensTrillionsJun2026)}{" "}
            across {STATS.brandCount} providers — China {STATS.chinaShareLabel}, US{" "}
            {STATS.usShareLabel}.
          </p>
        </div>
      </details>

      <p className="text-center text-xs text-slate-400">
        Google I/O &amp; Alphabet earnings · Volcano Engine FORCE · China National Data
        Administration · CAICT · Frost &amp; Sullivan · OpenRouter · WSJ ·{" "}
        {DATA_MONTH_START}–{DATA_MONTH_END}
      </p>
    </div>
  );
}
