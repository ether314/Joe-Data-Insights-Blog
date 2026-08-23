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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BAND_PRICE_AVERAGES,
  COUNTRY_AWARDS,
  GLOBAL_PROCEEDS,
  HEADLINE,
  SOURCE_NOTE,
  SOURCES,
  auctionOnly,
  fmtB,
  fmtMhzPop,
  fmtPct,
  obligationCoverageBuckets,
  priceCoverageQuadrants,
  topByPrice,
  type CountryAwardRow,
  type Region,
} from "@/data/global-5g-auction-proceeds-vs-coverage-2026-data";

// viz-types: price-coverage scatter, proceeds area, top-price bars, obligation composed, quadrant bars, band averages | layout: default

type ViewId =
  | "scatter"
  | "topprice"
  | "proceeds"
  | "obligations"
  | "quadrants"
  | "bands";

type DesignFilter = "auction-hybrid" | "all";

const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const ROSE = "#fb7185";
const EMERALD = "#34d399";
const VIOLET = "#a78bfa";
const SLATE = "#94a3b8";
const INDIGO = "#818cf8";

const REGION_COLORS: Record<Region, string> = {
  "North America": CYAN,
  Europe: VIOLET,
  "Asia-Pacific": EMERALD,
  "Latin America": AMBER,
  "Middle East": ROSE,
  Africa: INDIGO,
};

const ALL_REGIONS: Region[] = [
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Middle East",
  "Africa",
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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
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
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function filterRows(
  design: DesignFilter,
  regions: Set<Region>,
): CountryAwardRow[] {
  const base = design === "all" ? COUNTRY_AWARDS : auctionOnly();
  return base.filter((r) => regions.has(r.region));
}

export function Global5gAuctionProceedsVsCoverage2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [design, setDesign] = useState<DesignFilter>("auction-hybrid");
  const [regions, setRegions] = useState<Set<Region>>(() => new Set(ALL_REGIONS));
  const [logPrice, setLogPrice] = useState(false);

  const rows = useMemo(
    () => filterRows(design, regions),
    [design, regions],
  );

  const scatterData = useMemo(
    () =>
      rows
        .filter((r) => r.usdPerMhzPop > 0 || r.design === "admin")
        .map((r) => ({
          ...r,
          x: r.usdPerMhzPop,
          y: r.coveragePct,
          z: Math.max(r.proceedsUsdB, 0.2) * 40,
          fill: REGION_COLORS[r.region],
        })),
    [rows],
  );

  const topPrice = useMemo(() => topByPrice(10, rows.filter((r) => r.usdPerMhzPop > 0)), [rows]);
  const quadrants = useMemo(
    () => priceCoverageQuadrants(rows.filter((r) => r.design !== "admin" && r.usdPerMhzPop > 0)),
    [rows],
  );
  const obligations = useMemo(
    () => obligationCoverageBuckets(rows.filter((r) => r.design !== "admin")),
    [rows],
  );

  function toggleRegion(region: Region) {
    setRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) {
        if (next.size > 1) next.delete(region);
      } else {
        next.add(region);
      }
      return next;
    });
  }

  return (
    <div
      className="space-y-4"
      data-viz="global-5g-auction-proceeds-vs-coverage-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Radio spectrum · mid-band awards
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          $ per MHz-pop vs coverage
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          US C-band hit {fmtMhzPop(HEADLINE.usCbandUsdPerMhzPop)}/MHz-pop — roughly{" "}
          {(HEADLINE.usCbandUsdPerMhzPop / HEADLINE.recentCbandAvgUsdPerMhzPop).toFixed(0)}×
          the recent global C-band average. Across the auction sample, price and lagged
          5G population coverage show a weak negative rank link (
          {HEADLINE.priceCoverageSpearman}), not a buildout guarantee.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="US C-band peak"
            value={fmtMhzPop(HEADLINE.usCbandUsdPerMhzPop)}
            hint="/MHz-pop"
          />
          <Stat
            label="Recent C-band avg"
            value={fmtMhzPop(HEADLINE.recentCbandAvgUsdPerMhzPop)}
            hint="/MHz-pop"
          />
          <Stat
            label="2021 global proceeds"
            value={fmtB(HEADLINE.peakYearProceedsB, 0)}
            hint="GSA fee sample"
          />
          <Stat
            label="Brazil coverage"
            value={fmtPct(HEADLINE.brazilCoveragePct)}
            hint="obligation-heavy award"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "scatter", label: "Price vs coverage" },
            { id: "topprice", label: "Top $/MHz-pop" },
            { id: "proceeds", label: "Global proceeds" },
            { id: "obligations", label: "Obligations" },
            { id: "quadrants", label: "Quadrants" },
            { id: "bands", label: "Band averages" },
          ]}
        />
        <ToggleGroup
          label="Sample"
          value={design}
          onChange={setDesign}
          options={[
            { id: "auction-hybrid", label: "Auctions + hybrid" },
            { id: "all", label: "Incl. admin" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Regions
          </span>
          {ALL_REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleRegion(r)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                regions.has(r)
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {view === "scatter" ? (
          <ToggleGroup
            label="Price axis"
            value={logPrice ? "log" : "linear"}
            onChange={(v) => setLogPrice(v === "log")}
            options={[
              { id: "linear", label: "Linear $" },
              { id: "log", label: "Log $" },
            ]}
          />
        ) : null}
      </div>

      {view === "scatter" ? (
        <ChartCard
          title="Price vs coverage"
          subtitle="Bubble size ∝ award proceeds; color = region. High price does not map cleanly to faster coverage."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, bottom: 12, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="$/MHz-pop"
                  scale={logPrice ? "log" : "linear"}
                  domain={logPrice ? [0.005, "auto"] : [0, "auto"]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "USD per MHz-pop",
                    position: "insideBottom",
                    offset: -4,
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Coverage %"
                  domain={[40, 100]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "5G pop coverage %",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as CountryAwardRow & {
                      fill: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-900">{d.country}</p>
                        <p className="text-slate-600">
                          {fmtMhzPop(d.usdPerMhzPop)}/MHz-pop · {fmtPct(d.coveragePct)}{" "}
                          coverage
                        </p>
                        <p className="text-slate-500">
                          {d.awardYear} · {d.band} · {fmtB(d.proceedsUsdB)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} fill={CYAN}>
                  {scatterData.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <LegendRow />
        </ChartCard>
      ) : null}

      {view === "topprice" ? (
        <ChartCard
          title="Top $/MHz-pop"
          subtitle="Headline mid-band tranche prices in the filtered sample (admin zeros excluded)."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topPrice}
                layout="vertical"
                margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => fmtMhzPop(Number(v))}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  width={110}
                  tick={{ fontSize: 11, fill: "#334155" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as CountryAwardRow;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold">{d.country}</p>
                        <p>
                          {fmtMhzPop(d.usdPerMhzPop)}/MHz-pop · coverage{" "}
                          {fmtPct(d.coveragePct)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="usdPerMhzPop" radius={[0, 4, 4, 0]}>
                  {topPrice.map((d) => (
                    <Cell key={d.id} fill={REGION_COLORS[d.region]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "proceeds" ? (
        <ChartCard
          title="Global proceeds"
          subtitle="GSA fee-sample auction + assignment totals — 2021 spike driven by US C-band and peers."
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={GLOBAL_PROCEEDS}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <defs>
                  <linearGradient id="procFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CYAN} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={CYAN} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof GLOBAL_PROCEEDS)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold">{d.year}</p>
                        <p>{fmtB(d.proceedsUsdB)} disclosed fee sample</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="proceedsUsdB"
                  stroke={CYAN}
                  fill="url(#procFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "obligations" ? (
        <ChartCard
          title="Obligations"
          subtitle="Average lagged coverage and average $/MHz-pop by licence-obligation intensity (desk score 1–3)."
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={obligations}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  yAxisId="cov"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  domain={[40, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="price"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => fmtMhzPop(Number(v))}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof obligations)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold">{d.label}</p>
                        <p>
                          Avg coverage {fmtPct(d.avgCoveragePct, 1)} · avg price{" "}
                          {fmtMhzPop(d.avgUsdPerMhzPop)} (n={d.n})
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="cov"
                  dataKey="avgCoveragePct"
                  name="Avg coverage %"
                  fill={EMERALD}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="avgUsdPerMhzPop"
                  name="Avg $/MHz-pop"
                  stroke={AMBER}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "quadrants" ? (
        <ChartCard
          title="Quadrants"
          subtitle="Split at sample medians of $/MHz-pop and lagged coverage (auctions with positive price)."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={quadrants}
                margin={{ top: 12, right: 16, bottom: 48, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof quadrants)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold">{d.label}</p>
                        <p>
                          {d.count} countries
                          {d.examples ? ` · e.g. ${d.examples}` : ""}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {quadrants.map((q) => (
                    <Cell
                      key={q.id}
                      fill={
                        q.id === "high-price-high-cov"
                          ? EMERALD
                          : q.id === "high-price-low-cov"
                            ? ROSE
                            : q.id === "low-price-high-cov"
                              ? CYAN
                              : SLATE
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "bands" ? (
        <ChartCard
          title="Band averages"
          subtitle="Recent GSA average prices by band class — coverage spectrum still clears higher than mmWave."
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BAND_PRICE_AVERAGES}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => fmtMhzPop(Number(v))}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof BAND_PRICE_AVERAGES)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold">{d.label}</p>
                        <p>
                          {fmtMhzPop(d.avgUsdPerMhzPop)}/MHz-pop avg
                        </p>
                        <p className="text-slate-500">{d.note}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="avgUsdPerMhzPop" fill={VIOLET} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-slate-300 hover:text-slate-700"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-400">{hint}</p>
    </div>
  );
}

function LegendRow() {
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
      {ALL_REGIONS.map((r) => (
        <span key={r} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: REGION_COLORS[r] }}
          />
          {r}
        </span>
      ))}
    </div>
  );
}
