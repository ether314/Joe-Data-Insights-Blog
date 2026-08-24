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
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  AGGREGATE_SHARES,
  COUNTRY_STOCK,
  HEADLINE,
  PROVIDER_MIX,
  SOURCE_NOTE,
  TREND_SUMMARY,
  VIZ_MARKERS,
  countriesWithTrendPair,
  sortedByDecline,
  sortedByShare,
  type SizeBand,
} from "@/data/social-housing-stock-share-in-oecd-2026-data";

// viz-types: horizontal share bars, diverging decade-delta bars, stacked provider bars, share-vs-change scatter, size-band donut | layout: default

type PanelId = "ladder" | "delta" | "providers" | "scatter" | "bands";

type SortMode = "share-desc" | "decline-asc" | "dwellings-desc";

type BandFilter = "all" | SizeBand;

const COLORS = {
  large: "#0f766e",
  moderate: "#0369a1",
  small: "#b45309",
  minimal: "#94a3b8",
  decline: "#b91c1c",
  rise: "#15803d",
  national: "#1e3a5f",
  regional: "#0e7490",
  nonprofit: "#7c3aed",
  forProfit: "#c2410c",
  other: "#64748b",
  navy: "#0f172a",
  oecd: "#475569",
};

const BAND_LABEL: Record<SizeBand, string> = {
  large: "≥20% (large)",
  moderate: "10–19% (moderate)",
  small: "2–9% (small)",
  minimal: "<2% (minimal)",
  aggregate: "Aggregate",
};

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "ladder", label: "Share ladder" },
  { id: "delta", label: "Decade delta" },
  { id: "providers", label: "Provider mix" },
  { id: "scatter", label: "Stock vs change" },
  { id: "bands", label: "Size bands" },
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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function bandColor(band: SizeBand): string {
  if (band === "large") return COLORS.large;
  if (band === "moderate") return COLORS.moderate;
  if (band === "small") return COLORS.small;
  return COLORS.minimal;
}

function shortName(country: string): string {
  return country
    .replace("United Kingdom (England)", "UK (Eng.)")
    .replace("Slovak Republic", "Slovakia")
    .replace("United States", "U.S.")
    .replace("New Zealand", "N.Z.")
    .replace("Netherlands", "Neth.");
}

export function SocialHousingStockShareInOecd2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("ladder");
  const [band, setBand] = useState<BandFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("share-desc");
  const [showAggregates, setShowAggregates] = useState(true);

  const filtered = useMemo(() => {
    const base =
      band === "all"
        ? COUNTRY_STOCK
        : COUNTRY_STOCK.filter((c) => c.sizeBand === band);
    if (sortMode === "decline-asc") return sortedByDecline(base.filter((c) => c.changePp != null));
    if (sortMode === "dwellings-desc") {
      return [...base].sort(
        (a, b) => (b.socialDwellingsLatest ?? 0) - (a.socialDwellingsLatest ?? 0),
      );
    }
    return sortedByShare(base);
  }, [band, sortMode]);

  const ladderData = useMemo(() => {
    const rows = filtered.map((c) => ({
      name: shortName(c.country),
      full: c.country,
      share: Number(c.shareLatestPct.toFixed(2)),
      year: c.yearLatest,
      band: c.sizeBand,
      fill: bandColor(c.sizeBand),
    }));
    if (showAggregates && band === "all" && sortMode === "share-desc") {
      const inserts = AGGREGATE_SHARES.map((a) => ({
        name: a.label,
        full: a.label,
        share: Number(a.sharePct.toFixed(2)),
        year: null as number | null,
        band: "aggregate" as SizeBand,
        fill: COLORS.oecd,
      }));
      const oecdIdx = rows.findIndex((r) => r.share < HEADLINE.oecdAverageSharePct);
      const at = oecdIdx < 0 ? rows.length : oecdIdx;
      return [...rows.slice(0, at), ...inserts, ...rows.slice(at)];
    }
    return rows;
  }, [filtered, showAggregates, band, sortMode]);

  const deltaData = useMemo(() => {
    const pool =
      band === "all"
        ? countriesWithTrendPair()
        : countriesWithTrendPair().filter((c) => c.sizeBand === band);
    return sortedByDecline(pool).map((c) => ({
      name: shortName(c.country),
      full: c.country,
      change: Number((c.changePp ?? 0).toFixed(2)),
      share: c.shareLatestPct,
      fill: (c.changePp ?? 0) >= 0 ? COLORS.rise : COLORS.decline,
    }));
  }, [band]);

  const providerData = useMemo(() => {
    const ids = new Set(filtered.map((c) => c.id));
    return PROVIDER_MIX.filter((p) => ids.has(p.id) || band === "all").map((p) => ({
      name: shortName(p.country),
      full: p.country,
      National: p.nationalPct,
      Regional: p.regionalPct,
      "Non-profit": p.nonprofitPct,
      "For-profit": p.forProfitPct,
      Other: p.otherPct,
    }));
  }, [filtered, band]);

  const scatterData = useMemo(() => {
    const pool =
      band === "all"
        ? countriesWithTrendPair()
        : countriesWithTrendPair().filter((c) => c.sizeBand === band);
    return pool.map((c) => ({
      x: c.shareLatestPct,
      y: c.changePp ?? 0,
      z: Math.max(8, Math.sqrt((c.socialDwellingsLatest ?? 50_000) / 50_000) * 12),
      name: shortName(c.country),
      full: c.country,
      fill: bandColor(c.sizeBand),
    }));
  }, [band]);

  const bandPie = useMemo(() => {
    const counts: Record<Exclude<SizeBand, "aggregate">, number> = {
      large: 0,
      moderate: 0,
      small: 0,
      minimal: 0,
    };
    for (const c of COUNTRY_STOCK) {
      if (c.sizeBand === "aggregate") continue;
      counts[c.sizeBand] += 1;
    }
    return (Object.keys(counts) as Array<keyof typeof counts>).map((k) => ({
      name: BAND_LABEL[k],
      value: counts[k],
      fill: bandColor(k),
    }));
  }, []);

  const chartHeight = Math.max(320, ladderData.length * 22 + 80);

  return (
    <div
      className="space-y-4"
      data-viz="social-housing-stock-share-in-oecd-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {HEADLINE.largestShareCountry} {HEADLINE.largestSharePct.toFixed(1)}% · OECD avg{" "}
          {HEADLINE.oecdAverageSharePct.toFixed(1)}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Only {HEADLINE.countriesAbove20} OECD countries still clear a 20% social-rental share of
          dwellings. Across {HEADLINE.countriesWithPair} countries with a decade pair,{" "}
          {HEADLINE.countriesDeclineOf25WithPair} saw the relative stock shrink — led by Poland (
          {HEADLINE.sharpestDeclinePp.toFixed(2)} pp).
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTIONS}
          onChange={setPanel}
        />
        <ToggleGroup
          label="Size band"
          value={band}
          options={[
            { id: "all", label: "All countries" },
            { id: "large", label: "≥20%" },
            { id: "moderate", label: "10–19%" },
            { id: "small", label: "2–9%" },
            { id: "minimal", label: "<2%" },
          ]}
          onChange={(v) => setBand(v as BandFilter)}
        />
        <ToggleGroup
          label="Sort"
          value={sortMode}
          options={[
            { id: "share-desc", label: "Share ↓" },
            { id: "decline-asc", label: "Decline first" },
            { id: "dwellings-desc", label: "Units ↓" },
          ]}
          onChange={setSortMode}
        />
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showAggregates}
            onChange={(e) => setShowAggregates(e.target.checked)}
            className="rounded border-slate-300"
          />
          Show OECD / EU average markers on share ladder
        </label>
      </div>

      {panel === "ladder" ? (
        <ChartCard
          title="Share ladder"
          subtitle="Social rental dwellings as % of total housing stock (latest QuASH year)"
        >
          <div style={{ width: "100%", height: chartHeight }}>
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={ladderData}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit="%" domain={[0, 40]} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v)}%`, "Social rental share"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "delta" ? (
        <ChartCard
          title="Decade delta"
          subtitle="Percentage-point change in social-rental share (~2010 → latest)"
        >
          <div style={{ width: "100%", height: Math.max(360, deltaData.length * 22 + 60) }}>
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={deltaData}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit=" pp" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <ReferenceLine x={0} stroke="#334155" />
                <Tooltip
                  formatter={(v) => {
                    const n = Number(v);
                    return [`${n > 0 ? "+" : ""}${n} pp`, "Change"];
                  }}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                  {deltaData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            {TREND_SUMMARY.map((t) => (
              <li key={t.band} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-800">{t.label}</span>
                {": "}
                {t.count} countries — {t.examples}
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {panel === "providers" ? (
        <ChartCard
          title="Provider mix"
          subtitle="% of each country’s social stock by provider type (not % of all dwellings)"
        >
          <div style={{ width: "100%", height: Math.max(360, providerData.length * 36 + 80) }}>
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={providerData}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                stackOffset="expand"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `${Math.round(Number(v) * 100)}%`} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, name) => [`${Number(v).toFixed(1)}%`, String(name)]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <Legend />
                <Bar dataKey="National" stackId="p" fill={COLORS.national} />
                <Bar dataKey="Regional" stackId="p" fill={COLORS.regional} />
                <Bar dataKey="Non-profit" stackId="p" fill={COLORS.nonprofit} />
                <Bar dataKey="For-profit" stackId="p" fill={COLORS.forProfit} />
                <Bar dataKey="Other" stackId="p" fill={COLORS.other} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Stock vs change"
          subtitle="Latest share (x) vs decade change in pp (y); bubble ≈ social dwelling count"
        >
          <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Share"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Latest social rental %", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Change"
                  unit=" pp"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "pp change ~2010→latest",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[40, 280]} />
                <ReferenceLine y={0} stroke="#334155" />
                <ReferenceLine x={HEADLINE.oecdAverageSharePct} stroke="#94a3b8" strokeDasharray="4 4" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    const n = Number(v);
                    if (name === "x") return [`${n.toFixed(2)}%`, "Share"];
                    if (name === "y")
                      return [`${n > 0 ? "+" : ""}${n.toFixed(2)} pp`, "Change"];
                    return [n, String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "bands" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Size bands"
            subtitle="How many OECD QuASH countries fall in each social-stock size tier"
          >
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={bandPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {bandPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Material stock still exists — but rarely grows"
            subtitle="Large / moderate sectors vs the OECD average"
          >
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <ComposedChart
                  data={[
                    ...COUNTRY_STOCK.filter((c) => c.shareLatestPct >= 10).map((c) => ({
                      name: shortName(c.country),
                      share: c.shareLatestPct,
                      change: c.changePp,
                    })),
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                  <YAxis yAxisId="l" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="r" orientation="right" unit=" pp" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="l" dataKey="share" name="Share %" fill={COLORS.moderate} />
                  <Line
                    yAxisId="r"
                    type="monotone"
                    dataKey="change"
                    name="Δ pp"
                    stroke={COLORS.decline}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <ReferenceLine
                    yAxisId="l"
                    y={HEADLINE.oecdAverageSharePct}
                    stroke={COLORS.oecd}
                    strokeDasharray="4 4"
                    label="OECD avg"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
