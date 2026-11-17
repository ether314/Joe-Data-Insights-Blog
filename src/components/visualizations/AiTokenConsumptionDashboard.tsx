"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
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
  API_RATE_POINTS,
  BRAND_COLORS,
  BRAND_IDS,
  BRAND_LABELS,
  BRAND_ORIGIN,
  CHINA_MAAS_ECONOMICS,
  CHINA_NATIONAL_DAILY,
  DATA_MONTH_END,
  DATA_MONTH_START,
  DATA_REVIEWED_LABEL,
  GLOBAL_SUMMARY,
  IDC_EXTERNAL_MAAS,
  JUNE_2026_SLICE,
  LATEST_UPDATES,
  METHOD_NOTES,
  ORIGIN_COLORS,
  ORIGIN_TREND,
  ORIGINS,
  SOURCE_NOTE,
  STATS,
  TOKEN_MONTHLY,
  fmtPct,
  fmtTokensPerDay,
  fmtTokensT,
  type AiBrandId,
  type LatestUpdate,
  type Origin,
  type TokenMonthlyRecord,
} from "@/data/ai-token-consumption-data";

type BrandFilter = AiBrandId | "All";
type OriginFilter = Origin | "All";

/* ---------- shared look & feel ---------- */

const CARD =
  "rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.16)]";

const SERIF = { fontFamily: "var(--font-serif)" } as const;

const TOOLTIP = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 32px -12px rgba(15,23,42,0.25)",
    fontSize: 12,
    padding: "8px 12px",
  },
  labelStyle: { fontWeight: 700, color: "#0f172a", marginBottom: 2 },
  cursor: { fill: "rgba(100,116,139,0.08)" },
} as const;

const AXIS_TICK = { fontSize: 11, fill: "#64748b" } as const;

const GRID_STROKE = "#eef2f7";

function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia("(max-width: 640px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True on phone-width screens; false during server render. */
function useNarrow(): boolean {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia("(max-width: 640px)").matches,
    () => false,
  );
}

function fmtMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} '${y.slice(2)}`;
}

function shorten(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-600">{children}</p>
  );
}

function SectionHeading({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-24 pt-4">
      <Kicker>{kicker}</Kicker>
      <h2
        className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        style={SERIF}
      >
        {title}
      </h2>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  badge,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className={`${CARD} w-full min-w-0 overflow-hidden`}>
      <div className="flex items-start justify-between gap-3 px-5 pb-1 pt-5 sm:px-6">
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-slate-900" style={SERIF}>
            {title}
          </h3>
          {subtitle && <p className="mt-1 text-sm leading-snug text-slate-500">{subtitle}</p>}
        </div>
        {badge && (
          <span className="mt-0.5 shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 ring-1 ring-cyan-200">
            {badge}
          </span>
        )}
      </div>
      <div className="px-2 pb-4 pt-2 sm:px-4">{children}</div>
      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs leading-relaxed text-slate-600 sm:px-6">
          {footer}
        </div>
      )}
    </section>
  );
}

function SourcePill({ sourceType }: { sourceType: TokenMonthlyRecord["sourceType"] }) {
  const styles =
    sourceType === "disclosed"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${styles}`}>
      {sourceType === "disclosed" ? "Disclosed" : "Estimated"}
    </span>
  );
}

function OriginPill({ origin }: { origin: Origin }) {
  return (
    <span
      className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
      style={{ backgroundColor: ORIGIN_COLORS[origin] }}
    >
      {origin === "United States" ? "US" : origin}
    </span>
  );
}

const KIND_STYLE: Record<LatestUpdate["kind"], { label: string; dot: string; chip: string }> = {
  official: { label: "National", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 ring-amber-200" },
  earnings: { label: "Company", dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700 ring-blue-200" },
  gap: { label: "Still silent", dot: "bg-slate-400", chip: "bg-slate-100 text-slate-600 ring-slate-200" },
};

function HeroTile({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p
        className="mt-1.5 text-[1.6rem] font-bold leading-none tracking-tight text-white sm:text-3xl xl:text-[2rem]"
        style={SERIF}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-snug text-slate-300">{sub}</p>
    </div>
  );
}

/* ---------- dashboard ---------- */

export function AiTokenConsumptionDashboard() {
  const [brand, setBrand] = useState<BrandFilter>("All");
  const [origin, setOrigin] = useState<OriginFilter>("All");
  const narrow = useNarrow();

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

  const june2026Comparison = useMemo(
    () =>
      [...JUNE_2026_SLICE]
        .sort((a, b) => b.tokensTrillionsPerDay - a.tokensTrillionsPerDay)
        .map((r) => ({
          name: r.brand,
          tokens: r.tokensTrillionsPerDay,
          origin: r.origin,
          fill: ORIGIN_COLORS[r.origin],
        })),
    [],
  );

  const apiRate = useMemo(() => {
    const months: string[] = [];
    for (let y = 2025, m = 10; y < 2026 || m <= 10; ) {
      months.push(`${y}-${String(m).padStart(2, "0")}`);
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return months.map((ym) => {
      const pt = API_RATE_POINTS.find((p) => p.ym === ym);
      return {
        label: fmtMonthLabel(ym),
        ym,
        OpenAI: pt?.openai,
        Google: pt?.google,
        note: pt?.note ?? "",
      };
    });
  }, []);

  const nationalChart = useMemo(
    () =>
      CHINA_NATIONAL_DAILY.map((r) => ({
        label: fmtMonthLabel(r.yearMonth),
        perDay: r.tokensTrillionsPerDay,
        source: r.source,
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
    "rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200";

  const nationalJunePerDayT =
    CHINA_NATIONAL_DAILY[CHINA_NATIONAL_DAILY.length - 1].tokensTrillionsPerDay;
  const idc2025PerDayT = IDC_EXTERNAL_MAAS[1].tokensTrillionsPerDay;
  const stackVsIdc = GLOBAL_SUMMARY.chinaTokensPerDayJun2026 / idc2025PerDayT;
  const googleLatestPerDayT =
    [...API_RATE_POINTS].reverse().find((p) => p.google !== undefined)?.google ?? 0;

  return (
    <div className="site-content w-full min-w-0 space-y-6" data-viz="ai-token-consumption">
      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f1629] p-5 text-white shadow-[0_24px_60px_-28px_rgba(15,22,41,0.7)] sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 380px at 8% -10%, rgba(34,211,238,0.20), transparent 60%), radial-gradient(760px 420px at 100% 0%, rgba(220,38,38,0.22), transparent 60%), radial-gradient(700px 300px at 50% 120%, rgba(37,99,235,0.18), transparent 60%)",
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-300 ring-1 ring-cyan-300/30">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Refreshed {DATA_REVIEWED_LABEL}
          </span>
          <h2
            className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            style={SERIF}
          >
            Who processes the world&rsquo;s AI tokens?
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-300">
            {STATS.recordCount} records across {STATS.brandCount} providers (
            {GLOBAL_SUMMARY.chinaBrandCount} Chinese, {GLOBAL_SUMMARY.usBrandCount}{" "}
            American), updated with China&rsquo;s national count and Google&rsquo;s latest call. Every volume is shown as tokens per day.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <HeroTile
              label="Tracked volume · Jun 2026"
              value={STATS.totalJun2026Label}
              sub={`${fmtPct(GLOBAL_SUMMARY.yoyTotalGrowthPctJun2026)} YoY · ${fmtPct(GLOBAL_SUMMARY.momTotalGrowthPctJun2026)} MoM`}
              color="#818cf8"
            />
            <HeroTile
              label="China share · Jun 2026"
              value={STATS.chinaShareLabel}
              sub={`${fmtTokensPerDay(GLOBAL_SUMMARY.chinaTokensPerDayJun2026)} across ${GLOBAL_SUMMARY.chinaBrandCount} providers`}
              color={ORIGIN_COLORS.China}
            />
            <HeroTile
              label="China national count"
              value="500T+/day"
              sub="Mid-2026 · 3.6x the March figure"
              color="#f59e0b"
            />
            <HeroTile
              label="Google API volume · Q3 2026"
              value={`${Math.round(googleLatestPerDayT)}T/day`}
              sub="+40% in a quarter · first-party APIs only"
              color="#60a5fa"
            />
          </div>
        </div>
      </div>

      {/* ---------- latest ---------- */}
      <SectionHeading id="latest" kicker="November 2026 update" title="What changed since June" />

      <div className={`${CARD} overflow-hidden`}>
        <ol className="divide-y divide-slate-100">
          {LATEST_UPDATES.map((u) => {
            const k = KIND_STYLE[u.kind];
            return (
              <li key={u.title} className="grid gap-3 px-5 py-4 sm:grid-cols-[148px_1fr] sm:px-6">
                <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-1.5">
                  <span className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${k.dot}`} />
                    <span className="text-sm font-bold tabular-nums text-slate-900">{u.dateLabel}</span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${k.chip}`}
                  >
                    {k.label}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold leading-snug text-slate-900" style={SERIF}>
                    {u.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{u.body}</p>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Source:{" "}
                    {u.url ? (
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-cyan-700 underline decoration-cyan-200 underline-offset-2 hover:text-cyan-900"
                      >
                        {u.source}
                      </a>
                    ) : (
                      u.source
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------- national level ---------- */}
      <ChartCard
        title="US vs China token volume, Nov 2022 – Jun 2026"
        subtitle={
          crossoverLabel
            ? `Trillions of tokens per day, stacked by provider origin · China takes a durable lead from ${crossoverLabel}, after a brief DeepSeek R1-driven lead in early 2025`
            : "Trillions of tokens per day, stacked by provider origin"
        }
      >
        <ResponsiveContainer width="100%" height={narrow ? 320 : 380}>
          <AreaChart data={originTrend} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
            <defs>
              {ORIGINS.map((o) => (
                <linearGradient key={o} id={`grad-${o.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORIGIN_COLORS[o]} stopOpacity={0.85} />
                  <stop offset="100%" stopColor={ORIGIN_COLORS[o]} stopOpacity={0.18} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="month" tick={{ ...AXIS_TICK, fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => (Number(v) === 0 ? "0" : fmtTokensT(Number(v)))} />
            <Tooltip
              {...TOOLTIP}
              formatter={(v, n) => [fmtTokensPerDay(Number(v ?? 0)), String(n)]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.yearMonth ?? ""}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} iconType="circle" />
            {GLOBAL_SUMMARY.crossoverMonth && (
              <ReferenceLine
                x={crossoverLabel ?? undefined}
                stroke="#0f172a"
                strokeDasharray="4 4"
                label={{ value: "China > US", fontSize: 11, fontWeight: 700, fill: "#0f172a", position: "top" }}
              />
            )}
            {ORIGINS.map((o) => (
              <Area
                key={o}
                type="monotone"
                dataKey={o}
                stackId="1"
                stroke={ORIGIN_COLORS[o]}
                strokeWidth={1.75}
                fill={`url(#grad-${o.replace(/\s/g, "")})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="China's official national token volume"
          subtitle="Trillions of tokens called per day, as reported nationally"
          badge="Updated"
          footer={
            <>
              The mid-2026 point jumps 3.6x in one quarter — faster than any provider disclosed — so
              the national basis has probably widened. The counting rules are unpublished.
            </>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nationalChart} margin={{ top: 22, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}T`} />
              <Tooltip
                {...TOOLTIP}
                formatter={(v) => [`${Number(v ?? 0)}T tokens/day`, "National total"]}
                labelFormatter={(label, payload) =>
                  `${label}${payload?.[0]?.payload?.source ? " — " + payload[0].payload.source : ""}`
                }
              />
              <Bar dataKey="perDay" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                {nationalChart.map((r, i) => (
                  <Cell
                    key={r.label}
                    fill={ORIGIN_COLORS.China}
                    fillOpacity={i === nationalChart.length - 1 ? 1 : 0.55}
                  />
                ))}
                <LabelList
                  dataKey="perDay"
                  position="top"
                  formatter={(v) => `${Number(v ?? 0)}T`}
                  style={{ fontSize: 11, fontWeight: 700, fill: "#334155" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ---------- company level ---------- */}
        <ChartCard
          title="First-party API tokens per day"
          subtitle="Trillions of tokens a day · only figures the companies published"
          badge="New"
          footer={
            <>
              Both lines are API meters, not all-surfaces totals, and nothing between points is
              interpolated. The companies quote these meters per minute; the chart shows the same
              rate as a daily total.
            </>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={apiRate} margin={{ top: 18, right: 20, left: 0, bottom: 4 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="label" tick={{ ...AXIS_TICK, fontSize: 10 }} axisLine={false} tickLine={false} interval={narrow ? 2 : 1} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}T`} />
              <Tooltip
                {...TOOLTIP}
                formatter={(v, n) => [`${Number(v ?? 0)}T tokens/day`, String(n)]}
                labelFormatter={(label, payload) =>
                  `${label}${payload?.[0]?.payload?.note ? " — " + payload[0].payload.note : ""}`
                }
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} iconType="circle" />
              <Line
                type="linear"
                dataKey="Google"
                stroke={BRAND_COLORS.google}
                strokeWidth={3}
                isAnimationActive={false}
                connectNulls
                dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
              >
                <LabelList
                  dataKey="Google"
                  position="top"
                  offset={12}
                  formatter={(v) => (v == null ? "" : `${Number(v) < 10 ? Number(v).toFixed(1) : Math.round(Number(v))}T`)}
                  style={{ fontSize: 11, fontWeight: 700, fill: BRAND_COLORS.google }}
                />
              </Line>
              <Line
                type="linear"
                dataKey="OpenAI"
                stroke={BRAND_COLORS.openai}
                strokeWidth={3}
                isAnimationActive={false}
                connectNulls
                dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
              >
                <LabelList
                  dataKey="OpenAI"
                  position="top"
                  offset={12}
                  formatter={(v) => (v == null ? "" : `${Number(v) < 10 ? Number(v).toFixed(1) : Math.round(Number(v))}T`)}
                  style={{ fontSize: 11, fontWeight: 700, fill: BRAND_COLORS.openai }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="June 2026 provider comparison"
        subtitle="Estimated tokens processed per day, colored by provider origin"
      >
        <ResponsiveContainer width="100%" height={460}>
          <BarChart
            data={june2026Comparison}
            layout="vertical"
            margin={{ top: 4, right: narrow ? 48 : 64, left: 0, bottom: 4 }}
            barCategoryGap={6}
          >
            <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
            <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => (Number(v) === 0 ? "0" : fmtTokensT(Number(v)))} />
            <YAxis
              type="category"
              dataKey="name"
              interval={0}
              width={narrow ? 104 : 150}
              tick={{ fontSize: narrow ? 10 : 11, fill: "#334155" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => (narrow ? shorten(v, 16) : v)}
            />
            <Tooltip
              {...TOOLTIP}
              formatter={(v) => [fmtTokensPerDay(Number(v ?? 0)), "Tokens per day"]}
              labelFormatter={(label) => `${label} · Jun 2026`}
            />
            <Bar dataKey="tokens" radius={[0, 6, 6, 0]} isAnimationActive={false}>
              {june2026Comparison.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="tokens"
                position="right"
                formatter={(v) => fmtTokensT(Number(v ?? 0))}
                style={{ fontSize: 11, fontWeight: 700, fill: "#334155" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-5 shadow-sm sm:p-7">
        <Kicker>Three scopes, three very different numbers</Kicker>
        <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl" style={SERIF}>
          What companies claim, what the state counts, what the market pays for
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "What companies claim",
              value: fmtTokensPerDay(GLOBAL_SUMMARY.chinaTokensPerDayJun2026),
              note: "Sum of the ten Chinese provider meters, Jun 2026 daily average. Includes first-party apps and internal traffic; double-counts open weights re-served by other clouds.",
              accent: ORIGIN_COLORS.China,
            },
            {
              label: "What the state counts",
              value: fmtTokensPerDay(nationalJunePerDayT),
              note: "The national figure reported for mid-2026. Basis and counting rules unpublished.",
              accent: "#f59e0b",
            },
            {
              label: "What the market pays for",
              value: fmtTokensPerDay(idc2025PerDayT),
              note: "IDC public-cloud MaaS, external customers only — the daily average across all of 2025.",
              accent: "#0891b2",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="relative overflow-hidden rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
            >
              <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: c.accent }} />
              <p className="pl-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{c.label}</p>
              <p className="mt-1 pl-2 text-3xl font-bold text-slate-900" style={SERIF}>
                {c.value}
              </p>
              <p className="mt-1.5 pl-2 text-xs leading-relaxed text-slate-600">{c.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-amber-100/70 px-4 py-3 text-sm leading-relaxed text-amber-950">
          June&rsquo;s provider stack is about <strong>{stackVsIdc.toFixed(0)}x</strong>{" "}
          IDC&rsquo;s 2025 daily average — though that sets a mid-2026 meter against a 2025
          average. China&rsquo;s whole public-cloud model market earned{" "}
          <strong>
            RMB {CHINA_MAAS_ECONOMICS.revenueRmbBn}bn (~${CHINA_MAAS_ECONOMICS.revenueUsdM}M)
          </strong>{" "}
          across {CHINA_MAAS_ECONOMICS.year} on an average of {fmtTokensT(CHINA_MAAS_ECONOMICS.tokensTrillionsPerDay)}{" "}
          tokens a day — a blended{" "}
          <strong>${CHINA_MAAS_ECONOMICS.blendedUsdPerMTok} per million tokens</strong>.
        </p>
      </div>

      {/* ---------- data explorer ---------- */}
      <SectionHeading id="data" kicker="Data explorer" title="All 836 records" />

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="token-origin" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
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
          <label htmlFor="token-brand" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
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
        <p className="pb-2.5 text-sm text-slate-500" id="token-record-count">
          Showing {filtered.length} of {STATS.recordCount} records
        </p>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[960px] table-fixed text-[11px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
              <tr>
                {["Provider", "Origin", "Month", "Tokens per day", "MoM", "YoY", "Type", "Source"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-normal break-words px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/40">
                  <td className="whitespace-normal break-words px-2.5 py-2 font-semibold text-slate-900">
                    <span
                      className="mr-1.5 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: BRAND_COLORS[r.brandId] }}
                    />
                    {r.brand}
                  </td>
                  <td className="px-2.5 py-2">
                    <OriginPill origin={r.origin} />
                  </td>
                  <td className="px-2.5 py-2 text-slate-600">{r.yearMonth}</td>
                  <td className="whitespace-normal break-words px-2.5 py-2 font-medium text-slate-800">
                    {fmtTokensT(r.tokensTrillionsPerDay)}
                    {r.notes && (
                      <span className="mt-0.5 block text-[10px] font-normal text-slate-400">{r.notes}</span>
                    )}
                  </td>
                  <td className="px-2.5 py-2 text-slate-600">{fmtPct(r.momPct)}</td>
                  <td className="px-2.5 py-2 text-slate-600">{fmtPct(r.yoyPct)}</td>
                  <td className="px-2.5 py-2">
                    <SourcePill sourceType={r.sourceType} />
                  </td>
                  <td className="whitespace-normal break-words px-2.5 py-2 text-slate-500">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className="group rounded-2xl border border-sky-200 bg-sky-50/70 text-sm text-sky-950">
        <summary className="cursor-pointer select-none px-5 py-3.5 font-bold text-sky-900">
          Methodology &amp; caveats
        </summary>
        <div className="space-y-3 border-t border-sky-200 px-5 py-4 text-[13px] leading-relaxed text-sky-900">
          <p>
            <strong>Units:</strong> Every volume is tokens processed per day, in trillions (T) or
            billions (B). Monthly anchor totals are divided by 30, per-minute API meters are
            scaled up to a daily rate, and IDC&rsquo;s annual totals are shown as daily averages.
            Series are interpolated geometrically between anchor points; rows marked <em>disclosed</em> sit on a published figure.
          </p>
          <p>
            <strong>Why the monthly model stops in June 2026:</strong> since then only Google has
            published a new comparable provider figure. Extending the other 18 series would mean
            extrapolating undisclosed numbers, so new evidence is shown as separate, dated panels
            instead.
          </p>
          {METHOD_NOTES.map((note) => (
            <p key={note.slice(0, 32)}>{note}</p>
          ))}
          <p>
            <strong>June 2026 total:</strong> {fmtTokensPerDay(GLOBAL_SUMMARY.totalTokensTrillionsPerDayJun2026)}{" "}
            across {STATS.brandCount} providers — China {STATS.chinaShareLabel}, US {STATS.usShareLabel}.
          </p>
        </div>
      </details>

      <p className="text-center text-xs leading-relaxed text-slate-400">
        {SOURCE_NOTE}{" "}
        Alphabet Q3 2026 remarks · Volcano Engine FORCE · TechNode / CCTV · IDC · Frost &amp;
        Sullivan · {DATA_MONTH_START}–{DATA_MONTH_END} model, reviewed {DATA_REVIEWED_LABEL}.
      </p>
    </div>
  );
}
