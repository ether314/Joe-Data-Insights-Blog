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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  CONSTRUCTION_PROGRAM_MIX,
  ELECTRICIAN_COMPLETION,
  HEADLINE,
  INDUSTRY_SEX_MIX,
  SOURCE_NOTE,
  SYSTEM_TREND,
  TRADE_SEX_MIX,
  WOMEN_PORTFOLIO_SHIFT,
  type TradeFamily,
  type TradeSexRow,
} from "@/data/women-and-men-in-apprentice-trades-2026-data";

type Panel =
  | "system-trend"
  | "trade-ladder"
  | "wage-scatter"
  | "portfolio-shift"
  | "program-mix";

type FamilyFilter = TradeFamily | "all";
type SortMode = "share-asc" | "share-desc" | "women-count";

const COLORS = {
  women: "#c2410c",
  men: "#1e3a5f",
  share: "#0f766e",
  health: "#be185d",
  construction: "#b45309",
  military: "#1d4ed8",
  other: "#64748b",
  union: "#0f766e",
  nonUnion: "#9a3412",
  accent: "#ea580c",
  muted: "#94a3b8",
  grid: "#e2e8f0",
};

const FAMILY_LABELS: Record<FamilyFilter, string> = {
  all: "All trades",
  construction: "Construction",
  health: "Health",
  "care-education": "Care & education",
  transport: "Transport",
  "public-safety": "Public safety",
  other: "Other",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "system-trend": {
    title: "Women’s headcount rose faster than their share",
    subtitle:
      "RAPIDS active + completers with sex reported — count (bars) vs women share (line)",
  },
  "trade-ladder": {
    title: "Female share by apprentice trade",
    subtitle:
      "FY 2023 occupation groups — health aides near parity; plumbers and elevator constructors under 3%",
  },
  "wage-scatter": {
    title: "Exit wage vs female share",
    subtitle:
      "Bubble size = women apprentices; high-wage trades cluster at low female shares",
  },
  "portfolio-shift": {
    title: "Where women apprentices sit in the pipeline",
    subtitle:
      "Share of women apprentices by industry block — health rose while construction’s slice shrank",
  },
  "program-mix": {
    title: "Construction programs: union vs non-union",
    subtitle:
      "Programs with zero women vs programs with ≥10% women (IWPR RAPIDS construction sponsors)",
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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function familyColor(family: TradeFamily): string {
  switch (family) {
    case "health":
      return COLORS.health;
    case "construction":
      return COLORS.construction;
    case "care-education":
      return "#7c3aed";
    case "transport":
      return "#0369a1";
    case "public-safety":
      return "#15803d";
    default:
      return COLORS.other;
  }
}

function filterTrades(family: FamilyFilter, sort: SortMode): TradeSexRow[] {
  const base =
    family === "all" ? TRADE_SEX_MIX : TRADE_SEX_MIX.filter((t) => t.family === family);
  const rows = [...base];
  if (sort === "share-asc") rows.sort((a, b) => a.womenSharePct - b.womenSharePct);
  else if (sort === "share-desc") rows.sort((a, b) => b.womenSharePct - a.womenSharePct);
  else rows.sort((a, b) => b.women - a.women);
  return rows;
}

export function WomenAndMenInApprenticeTrades2026Dashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("trade-ladder");
  const [family, setFamily] = useState<FamilyFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("share-asc");

  const tradeRows = useMemo(
    () => filterTrades(family, sortMode),
    [family, sortMode],
  );

  const scatterRows = useMemo(() => {
    const base =
      family === "all"
        ? TRADE_SEX_MIX
        : TRADE_SEX_MIX.filter((t) => t.family === family);
    return base
      .filter((t) => t.womenExitWage != null)
      .map((t) => ({
        ...t,
        exitWage: t.womenExitWage as number,
        total: t.women + t.men,
      }));
  }, [family]);

  const meta = PANEL_META[panel];

  return (
    <div
      className={`w-full ${embedded ? "" : "mx-auto max-w-6xl px-4 py-6"}`}
      data-viz="women-and-men-in-apprentice-trades-2026"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-800">
            Labor & Skills · Apprenticeship pipelines
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Female share by trade
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Women were{" "}
            <span className="font-semibold text-slate-900">
              {HEADLINE.womenShareAll2023Pct}%
            </span>{" "}
            of RAPIDS apprentices with sex reported in FY 2023 — but{" "}
            <span className="font-semibold text-slate-900">
              {HEADLINE.constructionWomenSharePct}%
            </span>{" "}
            in construction versus{" "}
            <span className="font-semibold text-slate-900">
              {HEADLINE.healthWomenSharePct}%
            </span>{" "}
            in health & social assistance. The dashboard maps segregation by
            occupation, industry portfolio shift, and union program mix.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:min-w-[220px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              Construction ♀
            </p>
            <p className="text-lg font-bold text-orange-800">
              {HEADLINE.constructionWomenSharePct}%
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              Health ♀
            </p>
            <p className="text-lg font-bold text-pink-800">
              {HEADLINE.healthWomenSharePct}%
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(PANEL_META) as Panel[]).map((id) => (
          <ControlChip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {id === "system-trend"
              ? "System trend"
              : id === "trade-ladder"
                ? "Trade ladder"
                : id === "wage-scatter"
                  ? "Wage scatter"
                  : id === "portfolio-shift"
                    ? "Portfolio shift"
                    : "Program mix"}
          </ControlChip>
        ))}
      </div>

      {(panel === "trade-ladder" || panel === "wage-scatter") && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-xs font-medium uppercase tracking-wide text-slate-500">
              Family
            </span>
            {(Object.keys(FAMILY_LABELS) as FamilyFilter[]).map((f) => (
              <ControlChip
                key={f}
                active={family === f}
                onClick={() => setFamily(f)}
              >
                {FAMILY_LABELS[f]}
              </ControlChip>
            ))}
          </div>
          {panel === "trade-ladder" && (
            <div className="flex flex-wrap gap-2">
              <span className="self-center text-xs font-medium uppercase tracking-wide text-slate-500">
                Sort
              </span>
              <ControlChip
                active={sortMode === "share-asc"}
                onClick={() => setSortMode("share-asc")}
              >
                Lowest ♀ share
              </ControlChip>
              <ControlChip
                active={sortMode === "share-desc"}
                onClick={() => setSortMode("share-desc")}
              >
                Highest ♀ share
              </ControlChip>
              <ControlChip
                active={sortMode === "women-count"}
                onClick={() => setSortMode("women-count")}
              >
                Most women
              </ControlChip>
            </div>
          )}
        </div>
      )}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "system-trend" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={SYSTEM_TREND} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[8, 16]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "womenSharePct") return [`${n.toFixed(1)}%`, "Women share"];
                    if (name === "womenApprentices")
                      return [n.toLocaleString(), "Women apprentices"];
                    return [n.toLocaleString(), String(name)];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="womenApprentices"
                  name="Women apprentices"
                  fill={COLORS.women}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="womenSharePct"
                  name="Women share %"
                  stroke={COLORS.share}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "trade-ladder" && (
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tradeRows}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="shortLabel"
                  width={96}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "womenSharePct") return [`${n.toFixed(1)}%`, "Female share"];
                    return [n, String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.trade ?? ""
                  }
                />
                <Bar dataKey="womenSharePct" name="Female share" radius={[0, 4, 4, 0]}>
                  {tradeRows.map((row) => (
                    <Cell key={row.trade} fill={familyColor(row.family)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "wage-scatter" && (
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="womenSharePct"
                  name="Female share"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Female share of apprentices (%)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="exitWage"
                  name="Exit wage"
                  unit="$"
                  domain={[12, 52]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Women median exit $/hr",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="women" range={[40, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "womenSharePct") return [`${n.toFixed(1)}%`, "Female share"];
                    if (name === "exitWage") return [`$${n.toFixed(2)}`, "Women exit wage"];
                    if (name === "women") return [n.toLocaleString(), "Women apprentices"];
                    return [n, String(name)];
                  }}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.trade ?? ""}
                />
                <Scatter name="Trades" data={scatterRows}>
                  {scatterRows.map((row) => (
                    <Cell key={row.trade} fill={familyColor(row.family)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "portfolio-shift" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={WOMEN_PORTFOLIO_SHIFT}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const labels: Record<string, string> = {
                      healthPct: "Health & social",
                      constructionPct: "Construction",
                      militaryPublicPct: "Public admin / military",
                      otherPct: "Other",
                    };
                    return [`${n.toFixed(1)}%`, labels[String(name)] ?? String(name)];
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="healthPct"
                  name="Health & social"
                  stackId="1"
                  stroke={COLORS.health}
                  fill={COLORS.health}
                  fillOpacity={0.85}
                />
                <Area
                  type="monotone"
                  dataKey="constructionPct"
                  name="Construction"
                  stackId="1"
                  stroke={COLORS.construction}
                  fill={COLORS.construction}
                  fillOpacity={0.85}
                />
                <Area
                  type="monotone"
                  dataKey="militaryPublicPct"
                  name="Public admin / military"
                  stackId="1"
                  stroke={COLORS.military}
                  fill={COLORS.military}
                  fillOpacity={0.75}
                />
                <Area
                  type="monotone"
                  dataKey="otherPct"
                  name="Other"
                  stackId="1"
                  stroke={COLORS.other}
                  fill={COLORS.other}
                  fillOpacity={0.7}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "program-mix" && (
          <div className="space-y-6">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CONSTRUCTION_PROGRAM_MIX}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const n = typeof value === "number" ? value : Number(value);
                      const label =
                        name === "zeroWomenPct"
                          ? "Programs with 0 women"
                          : "Programs with ≥10% women";
                      return [`${n.toFixed(1)}%`, label];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="zeroWomenPct"
                    name="Zero women"
                    fill={COLORS.nonUnion}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="atLeast10PctWomenPct"
                    name="≥10% women"
                    fill={COLORS.union}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {ELECTRICIAN_COMPLETION.map((row) => (
                <div
                  key={row.program}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Women electrician completion · {row.program}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {row.womenCompletionPct}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartCard>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Industry</th>
              <th className="px-4 py-3 font-semibold">♀ share</th>
              <th className="px-4 py-3 font-semibold">% of women</th>
              <th className="px-4 py-3 font-semibold">% of men</th>
              <th className="px-4 py-3 font-semibold">♀ exit $/hr</th>
            </tr>
          </thead>
          <tbody>
            {INDUSTRY_SEX_MIX.map((row) => (
              <tr key={row.industry} className="border-t border-slate-100">
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {row.shortLabel}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-slate-700">
                  {row.womenSharePct.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 tabular-nums text-slate-700">
                  {row.shareOfWomenApprenticesPct.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 tabular-nums text-slate-700">
                  {row.shareOfMenApprenticesPct.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 tabular-nums text-slate-700">
                  {row.womenExitWage != null
                    ? `$${row.womenExitWage.toFixed(2)}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE} Fastest construction share gain in this build:{" "}
        {ANALYTICS.fastestConstructionGainTrade} (+
        {ANALYTICS.fastestConstructionGainPp} pp, 2016–2023 aligned). Completer
        earnings ratio (women/men median exit wage):{" "}
        {HEADLINE.completerEarningsRatioPct}%.
      </p>
    </div>
  );
}
