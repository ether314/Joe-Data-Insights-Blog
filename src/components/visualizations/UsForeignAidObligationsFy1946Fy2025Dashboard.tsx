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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DATA,
  SOURCE_NOTE,
} from "@/data/us-foreign-aid-obligations-fy1946-fy2025-data";
import { WORLD, MAP_POINTS } from "@/data/world-currency-pegs-2026-data";

// viz-types: stacked annual line, econ/mil pie, top-12 bar, region bar, bubble map, country table
// smoke-marker: US foreign aid obligations FY1946–FY2025

// --- Map geometry: reuse the projected WORLD path data + MAP_POINTS used by the
// currency-pegs dashboard so the aid bubble map shares the same 1200x620
// coordinate space and country outlines instead of floating dots on a void. ---
const WORLD_BY_NAME = new Map<string, { x: number; y: number }>();
for (const f of WORLD) WORLD_BY_NAME.set(f.n, { x: f.x, y: f.y });
for (const p of MAP_POINTS) {
  if (!WORLD_BY_NAME.has(p.n)) WORLD_BY_NAME.set(p.n, { x: p.x, y: p.y });
}

// Aid-data names sometimes differ from the map's country names; alias them.
const NAME_ALIASES: Record<string, string> = {
  "Berlin, West": "Germany",
  "Burma (Myanmar)": "Myanmar",
  "China (Hong Kong, S.A.R., P.R.C.)": "Hong Kong",
  "China (Macau, S.A.R., P.R.C.)": "Macau",
  "China (P.R.C.)": "China",
  "China (Tibet)": "China",
  Congo: "Republic of the Congo",
  "Czechoslovakia (former)": "Czechia",
  "Democratic Republic of the Congo": "DR Congo",
  Gambia: "The Gambia",
  "Germany (former East)": "Germany",
  "Kiribati, Republic of": "Kiribati",
  "Korea, Democratic Republic of": "North Korea",
  "Korea, Republic of": "South Korea",
  "Micronesia, Federated States of": "Micronesia",
  "Serbia and Montenegro (former)": "Serbia",
  "Slovak Republic": "Slovakia",
  "Soviet Union (former)": "Russia",
  "St. Kitts and Nevis": "Saint Kitts and Nevis",
  "St. Lucia": "Saint Lucia",
  "St. Vincent and Grenadines": "Saint Vincent and the Grenadines",
  "Sudan (former)": "Sudan",
  "Turks and Caicos Islands": "Turks and Caicos",
  "Vietnam (former South)": "Vietnam",
  "West Bank and Gaza": "Palestine",
  "Yemen (former P.D.R.)": "Yemen",
  "Yugoslavia (former)": "Serbia",
};

// Linear lon/lat -> 1200x620 fallback (fitted to WORLD centroids; accurate for
// low/mid latitudes). Used only for the handful of recipients with no modern
// country match (e.g. French Guiana, British Indian Ocean Territory).
function projectLinear(lon: number, lat: number): { x: number; y: number } {
  return { x: 3.025 * lon + 596.8, y: -4.355 * lat + 380.6 };
}

function resolveCentroid(
  name: string,
  lon?: number,
  lat?: number,
): { x: number; y: number } | null {
  const alias = NAME_ALIASES[name];
  const hit = WORLD_BY_NAME.get(name) ?? (alias ? WORLD_BY_NAME.get(alias) : undefined);
  if (hit) return hit;
  if (typeof lon === "number" && typeof lat === "number") return projectLinear(lon, lat);
  return null;
}

const NAVY_BG = "#0f1629";
const NAVY_DEEP = "#0a1020";
const NAVY_PANEL = "#131c33";
const NAVY_BORDER = "#1f2a44";
const INK = "#e2e8f0";
const INK_MUTED = "#94a3b8";
const INK_DIM = "#64748b";
const COL_ECON = "#38bdf8";
const COL_MIL = "#f59e0b";

const DECADES = [
  { value: "all", label: "All years" },
  { value: "1940", label: "1940s" },
  { value: "1950", label: "1950s" },
  { value: "1960", label: "1960s" },
  { value: "1970", label: "1970s" },
  { value: "1980", label: "1980s" },
  { value: "1990", label: "1990s" },
  { value: "2000", label: "2000s" },
  { value: "2010", label: "2010s" },
  { value: "2020", label: "2020s" },
] as const;

type DecadeValue = (typeof DECADES)[number]["value"];
type KindFilter = "all" | "econ" | "mil";
type SortKey = "n" | "r" | "e" | "m" | "t" | "pct";

function fmtM(m: number): string {
  const v = Math.abs(m);
  const s = m < 0 ? "-" : "";
  if (v >= 1000) return `${s}$${(v / 1000).toFixed(1)}B`;
  if (v >= 10) return `${s}$${v.toFixed(0)}M`;
  if (v >= 1) return `${s}$${v.toFixed(1)}M`;
  if (v > 0) return `${s}$${(v * 1000).toFixed(0)}K`;
  return "$0";
}

function decadeRange(d: string): string {
  if (d === "all") return "FY1946–FY2025";
  if (d === "1940") return "FY1946–FY1949";
  if (d === "2020") return "FY2020–FY2025";
  const y = Number(d);
  return `FY${y}–FY${y + 9}`;
}

function amt(e: number, m: number, kind: string): number {
  if (kind === "econ") return e;
  if (kind === "mil") return m;
  return e + m;
}

function AidMap({
  points,
  onPick,
}: {
  points: Array<{ id: string; n: string; x: number; y: number; t: number; mil: number }>;
  onPick: (id: string) => void;
}) {
  const max = Math.max(...points.map((p) => p.t), 1);
  const w = 1200;
  const h = 620;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="Bubble map of US foreign aid by country"
      style={{ display: "block", height: "auto", background: NAVY_DEEP }}
    >
      <rect x={0} y={0} width={w} height={h} fill={NAVY_DEEP} />
      {/* Faint country outlines (shared WORLD geometry, 1200x620 projection). */}
      {WORLD.map((f) => (
        <path
          key={f.n}
          d={f.d}
          fill={NAVY_PANEL}
          fillOpacity={0.55}
          stroke={NAVY_BORDER}
          strokeWidth={0.45}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      ))}
      <text x={12} y={20} fill={INK_DIM} fontSize={13} vectorEffect="non-scaling-stroke">
        Bubble size is inflation-adjusted aid. Darker fill = higher military share.
      </text>
      {points.map((p) => {
        const c = resolveCentroid(p.n, p.x, p.y);
        if (!c) return null;
        const r = 3 + Math.sqrt(p.t / max) * 26;
        const milShare = p.t > 0 ? p.mil / p.t : 0;
        return (
          <circle
            key={p.id}
            cx={c.x}
            cy={c.y}
            r={r}
            fill={COL_MIL}
            fillOpacity={0.25 + milShare * 0.55}
            stroke={NAVY_BORDER}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            style={{ cursor: "pointer" }}
            onClick={() => onPick(p.id)}
          >
            <title>{`${p.n}: ${fmtM(p.t)}`}</title>
          </circle>
        );
      })}
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg border px-4 py-3"
      style={{ background: NAVY_PANEL, borderColor: NAVY_BORDER }}
    >
      <p className="text-xs uppercase tracking-wide" style={{ color: INK_DIM }}>
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tabular-nums" style={{ color: INK }}>
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg border p-4 sm:p-5"
      style={{ background: NAVY_PANEL, borderColor: NAVY_BORDER }}
    >
      <h4 className="text-sm font-semibold" style={{ color: INK }}>
        {title}
      </h4>
      {subtitle ? (
        <p className="mt-1 text-xs" style={{ color: INK_DIM }}>
          {subtitle}
        </p>
      ) : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function UsForeignAidObligationsFy1946Fy2025Dashboard() {
  const [decade, setDecade] = useState<DecadeValue>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [region, setRegion] = useState("all");
  const [q, setQ] = useState("");
  const [pick, setPick] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("t");
  const [sortAsc, setSortAsc] = useState(false);

  const meta = DATA.meta;

  const regions = useMemo(() => {
    const s = new Set(meta.map((m) => m.r));
    return ["all", ...Array.from(s).sort()];
  }, [meta]);

  const filteredIdx = useMemo(() => {
    const query = q.trim().toLowerCase();
    const out: number[] = [];
    meta.forEach((m, i) => {
      if (m.t === "r") return;
      if (region !== "all" && m.r !== region) return;
      if (
        query &&
        !m.n.toLowerCase().includes(query) &&
        !m.id.toLowerCase().includes(query)
      )
        return;
      out.push(i);
    });
    return out;
  }, [meta, q, region]);

  const allowed = useMemo(() => new Set(filteredIdx), [filteredIdx]);

  const decadeRows = useMemo(() => {
    const want = decade === "all" ? null : Number(decade);
    const acc = new Map<number, { e: number; m: number }>();
    for (const [i, d, e, m] of DATA.decade) {
      if (!allowed.has(i)) continue;
      if (want !== null && d !== want) continue;
      const cur = acc.get(i) || { e: 0, m: 0 };
      cur.e += e;
      cur.m += m;
      acc.set(i, cur);
    }
    return acc;
  }, [allowed, decade]);

  const allTimeAll = useMemo(() => {
    let e = 0;
    let m = 0;
    for (const row of DATA.decade) {
      e += row[2];
      m += row[3];
    }
    return { e, m, t: e + m };
  }, []);
  const allTimeGrand = allTimeAll.t;

  const ranked = useMemo(() => {
    const rows = Array.from(decadeRows.entries()).map(([i, v]) => ({
      i,
      ...meta[i],
      e: v.e,
      m: v.m,
      t: amt(v.e, v.m, kind),
    }));
    rows.sort((a, b) => b.t - a.t);
    return rows.filter((r) => r.t !== 0);
  }, [decadeRows, kind, meta]);

  const totals = useMemo(() => {
    let e = 0;
    let m = 0;
    for (const r of ranked) {
      e += r.e;
      m += r.m;
    }
    return { e, m, t: e + m };
  }, [ranked]);

  const yearlySeries = useMemo(() => {
    const lo =
      decade === "all"
        ? 1946
        : decade === "1940"
          ? 1946
          : Number(decade);
    const hi =
      decade === "all"
        ? 2025
        : decade === "1940"
          ? 1949
          : decade === "2020"
            ? 2025
            : Number(decade) + 9;

    if (pick) {
      const idx = meta.findIndex((m) => m.id === pick);
      const rows: { year: string; economic: number; military: number }[] = [];
      for (const [i, y, ev, mv] of DATA.cy) {
        if (i !== idx) continue;
        if (y < lo || y > hi) continue;
        rows.push({
          year: String(y),
          economic: kind === "mil" ? 0 : ev / 1000,
          military: kind === "econ" ? 0 : mv / 1000,
        });
      }
      rows.sort((a, b) => Number(a.year) - Number(b.year));
      return { rows, title: meta[idx] ? meta[idx].n : pick };
    }

    const acc = new Map<number, { e: number; m: number }>();
    for (const [i, y, ev, mv] of DATA.cy) {
      if (!allowed.has(i)) continue;
      if (y < lo || y > hi) continue;
      const cur = acc.get(y) || { e: 0, m: 0 };
      cur.e += ev;
      cur.m += mv;
      acc.set(y, cur);
    }
    const years = Array.from(acc.keys()).sort((a, b) => a - b);
    return {
      rows: years.map((y) => ({
        year: String(y),
        economic: kind === "mil" ? 0 : (acc.get(y)?.e || 0) / 1000,
        military: kind === "econ" ? 0 : (acc.get(y)?.m || 0) / 1000,
      })),
      title: "All recipients in view",
    };
  }, [allowed, decade, kind, meta, pick]);

  const top = ranked.slice(0, 12);

  const mapPts = ranked
    .filter((r) => r.xy && r.t > 0)
    .map((r) => ({
      id: r.id,
      n: r.n,
      x: r.xy![0],
      y: r.xy![1],
      t: r.t,
      mil: r.m,
    }));

  const regionRoll = useMemo(() => {
    const acc = new Map<string, { e: number; m: number }>();
    for (const r of ranked) {
      const cur = acc.get(r.r) || { e: 0, m: 0 };
      cur.e += r.e;
      cur.m += r.m;
      acc.set(r.r, cur);
    }
    return Array.from(acc.entries())
      .sort((a, b) => b[1].e + b[1].m - (a[1].e + a[1].m))
      .slice(0, 8)
      .map(([name, v]) => ({
        region: name,
        economic: kind === "mil" ? 0 : v.e,
        military: kind === "econ" ? 0 : v.m,
        total: v.e + v.m,
      }));
  }, [kind, ranked]);

  const topBarData = useMemo(
    () =>
      top.map((r) => ({
        name: r.n.length > 22 ? `${r.n.slice(0, 20)}…` : r.n,
        fullName: r.n,
        economic: kind === "mil" ? 0 : r.e,
        military: kind === "econ" ? 0 : r.m,
      })),
    [kind, top],
  );

  const pieData = useMemo(
    () => [
      { name: "Economic", value: Math.max(totals.e, 0) },
      { name: "Military", value: Math.max(totals.m, 0) },
    ],
    [totals.e, totals.m],
  );

  const sortedTable = useMemo(() => {
    const rows = ranked.map((r) => ({
      ...r,
      pct: allTimeGrand > 0 ? (100 * (r.e + r.m)) / allTimeGrand : 0,
    }));
    rows.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sortKey === "n") {
        av = a.n;
        bv = b.n;
      } else if (sortKey === "r") {
        av = a.r;
        bv = b.r;
      } else if (sortKey === "e") {
        av = a.e;
        bv = b.e;
      } else if (sortKey === "m") {
        av = a.m;
        bv = b.m;
      } else if (sortKey === "t") {
        av = a.e + a.m;
        bv = b.e + b.m;
      } else {
        av = a.pct;
        bv = b.pct;
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return rows;
  }, [allTimeGrand, ranked, sortAsc, sortKey]);

  const picked = pick ? meta.find((m) => m.id === pick) : undefined;
  const displayKind =
    kind === "all"
      ? "economic + military"
      : kind === "econ"
        ? "economic"
        : "military";

  const y2024 = DATA.yearly.find((r) => r[0] === 2024);
  const y2025 = DATA.yearly.find((r) => r[0] === 2025);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(key === "n" || key === "r");
    }
  }

  function SortTh({
    label,
    col,
    align = "left",
  }: {
    label: string;
    col: SortKey;
    align?: "left" | "right";
  }) {
    const active = sortKey === col;
    return (
      <th
        className={`cursor-pointer select-none px-3 py-2 text-xs font-semibold uppercase tracking-wide ${align === "right" ? "text-right" : "text-left"}`}
        style={{ color: active ? INK : INK_DIM }}
        onClick={() => toggleSort(col)}
      >
        {label}
        {active ? (sortAsc ? " ↑" : " ↓") : ""}
      </th>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border shadow-sm"
      style={{ borderColor: NAVY_BORDER, background: NAVY_BG }}
      data-viz="us-foreign-aid-obligations-fy1946-fy2025"
    >
      <div
        className="border-b px-4 py-5 sm:px-6"
        style={{ borderColor: NAVY_BORDER, background: NAVY_DEEP }}
      >
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: COL_ECON }}>
          ForeignAssistance.gov · constant FY2025$
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl" style={{ color: INK }}>
          US foreign aid obligations, FY1946–FY2025
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: INK_MUTED }}>
          Inflation-adjusted obligations across {meta.filter((m) => m.t === "c").length} country
          recipients. Decade chips slice 80 years of economic and military aid. World and regional
          programs are spread to countries in proportion to each country&apos;s attributed aid that
          year.
        </p>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {DECADES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDecade(d.value)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition"
              style={{
                background: decade === d.value ? COL_ECON : NAVY_PANEL,
                color: decade === d.value ? NAVY_DEEP : INK_MUTED,
                border: `1px solid ${decade === d.value ? COL_ECON : NAVY_BORDER}`,
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as KindFilter)}
            className="rounded-md border px-3 py-2 text-sm"
            style={{ background: NAVY_PANEL, borderColor: NAVY_BORDER, color: INK }}
          >
            <option value="all">Economic + military</option>
            <option value="econ">Economic only</option>
            <option value="mil">Military only</option>
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
            style={{ background: NAVY_PANEL, borderColor: NAVY_BORDER, color: INK }}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All regions" : r}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter country…"
            className="min-w-[180px] flex-1 rounded-md border px-3 py-2 text-sm sm:max-w-xs"
            style={{ background: NAVY_PANEL, borderColor: NAVY_BORDER, color: INK }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label={`${displayKind} · ${decadeRange(decade)}`}
            value={fmtM(
              kind === "all" ? totals.t : kind === "econ" ? totals.e : totals.m,
            )}
          />
          <Stat label="Economic" value={fmtM(totals.e)} />
          <Stat label="Military" value={fmtM(totals.m)} />
          <Stat label="Recipients in view" value={String(ranked.length)} />
        </div>

        {(decade === "2020" || decade === "all") && y2024 && y2025 ? (
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{ background: "#0c2340", borderColor: "#1e40af", color: INK_MUTED }}
          >
            <span className="font-semibold" style={{ color: COL_ECON }}>
              FY2025 is in the series.
            </span>{" "}
            Obligations fell to {fmtM(y2025[1] + y2025[2])} in FY2025 from{" "}
            {fmtM(y2024[1] + y2024[2])} in FY2024 (full-year, all agencies). FY2026 reports exist but
            are incomplete and are excluded.
          </div>
        ) : null}

        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{ background: NAVY_PANEL, borderColor: NAVY_BORDER, color: INK_MUTED }}
        >
          World and regional pots are spread to countries in proportion to each country&apos;s
          attributed aid that fiscal year. Regional pots stay inside that region; World pots go to
          all countries. The all-time total is unchanged.
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel
            title="Annual obligations (FY2025 $ billions)"
            subtitle={`${yearlySeries.title} · ${decadeRange(decade)} · stacked economic vs military`}
          >
            <div className="h-[260px] w-full">
              {yearlySeries.rows.length > 0 ? (
                <ResponsiveContainer>
                  <ComposedChart data={yearlySeries.rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={NAVY_BORDER} />
                    <XAxis dataKey="year" tick={{ fill: INK_DIM, fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: INK_DIM, fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                    <Tooltip
                      contentStyle={{ background: NAVY_PANEL, border: `1px solid ${NAVY_BORDER}`, color: INK }}
                      formatter={(v) => [`$${Number(v ?? 0).toFixed(1)}B`, ""]}
                    />
                    <Legend wrapperStyle={{ color: INK_MUTED, fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="economic"
                      name="Economic"
                      stackId="1"
                      stroke={COL_ECON}
                      fill={COL_ECON}
                      fillOpacity={0.55}
                    />
                    <Area
                      type="monotone"
                      dataKey="military"
                      name="Military"
                      stackId="1"
                      stroke={COL_MIL}
                      fill={COL_MIL}
                      fillOpacity={0.55}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm" style={{ color: INK_DIM }}>
                  No annual data for this filter.
                </p>
              )}
            </div>
          </Panel>

          <Panel
            title="Economic vs military"
            subtitle={`Share of obligations in view · ${decadeRange(decade)}`}
          >
            <div className="h-[260px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={96}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill={COL_ECON} />
                    <Cell fill={COL_MIL} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: NAVY_PANEL, border: `1px solid ${NAVY_BORDER}` }}
                    formatter={(v) => [fmtM(Number(v ?? 0)), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs" style={{ color: INK_DIM }}>
              Mix uses Greenbook categories through FY2019 and funding-account classification
              FY2020–FY2025.
            </p>
          </Panel>
        </div>

        <Panel
          title={`Largest recipients · ${decadeRange(decade)}`}
          subtitle={`Horizontal bars in FY2025 $ millions · ${displayKind}`}
        >
          <div
            className="w-full"
            style={{ height: Math.max(240, topBarData.length * 28) }}
          >
            {topBarData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart
                  data={topBarData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={NAVY_BORDER} horizontal={false} />
                  <XAxis type="number" tick={{ fill: INK_DIM, fontSize: 11 }} tickFormatter={(v) => fmtM(v)} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: INK_MUTED, fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ background: NAVY_PANEL, border: `1px solid ${NAVY_BORDER}` }}
                    formatter={(v) => [fmtM(Number(v ?? 0)), ""]}
                    labelFormatter={(_, p) =>
                      (p?.[0]?.payload as { fullName?: string })?.fullName ?? ""
                    }
                  />
                  <Legend wrapperStyle={{ color: INK_MUTED, fontSize: 12 }} />
                  <Bar dataKey="economic" name="Economic" stackId="a" fill={COL_ECON} />
                  <Bar dataKey="military" name="Military" stackId="a" fill={COL_MIL} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </Panel>

        {regionRoll.length > 0 ? (
          <Panel title={`Aid by region · ${decadeRange(decade)}`}>
            <div
              className="w-full"
              style={{ height: Math.max(200, regionRoll.length * 28) }}
            >
              <ResponsiveContainer>
                <BarChart
                  data={regionRoll}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={NAVY_BORDER} horizontal={false} />
                  <XAxis type="number" tick={{ fill: INK_DIM, fontSize: 11 }} tickFormatter={(v) => fmtM(v)} />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={160}
                    tick={{ fill: INK_MUTED, fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ background: NAVY_PANEL, border: `1px solid ${NAVY_BORDER}` }}
                    formatter={(v) => [fmtM(Number(v ?? 0)), ""]}
                  />
                  <Legend wrapperStyle={{ color: INK_MUTED, fontSize: 12 }} />
                  <Bar dataKey="economic" name="Economic" stackId="b" fill={COL_ECON} />
                  <Bar dataKey="military" name="Military" stackId="b" fill={COL_MIL} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        ) : null}

        {mapPts.length > 0 ? (
          <Panel
            title="Where the money went"
            subtitle="Click a bubble to isolate that country in the annual chart. Darker fill = higher military share."
          >
            <div style={{ borderColor: NAVY_BORDER }} className="overflow-hidden rounded-lg border">
              <AidMap points={mapPts} onPick={setPick} />
            </div>
          </Panel>
        ) : null}

        {picked ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: INK }}>
              Focused: {picked.n}
            </span>
            <button
              type="button"
              onClick={() => setPick("")}
              className="rounded-md border px-3 py-1 text-xs font-medium"
              style={{ borderColor: NAVY_BORDER, color: INK_MUTED, background: NAVY_PANEL }}
            >
              Clear country
            </button>
          </div>
        ) : null}

        <Panel
          title={`All countries · ${decadeRange(decade)}`}
          subtitle={`${ranked.length} countries · all-time total ${fmtM(allTimeGrand)} including World + regional allocation`}
        >
          <div className="max-h-[480px] overflow-auto rounded-lg border" style={{ borderColor: NAVY_BORDER }}>
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-10" style={{ background: NAVY_DEEP }}>
                <tr>
                  <SortTh label="Recipient" col="n" />
                  <SortTh label="Region" col="r" />
                  <SortTh label="Economic" col="e" align="right" />
                  <SortTh label="Military" col="m" align="right" />
                  <SortTh label="Total" col="t" align="right" />
                  <SortTh label="% all-time" col="pct" align="right" />
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: "#1a2744", color: INK }}>
                  <td className="px-3 py-2 font-semibold">TOTAL SPEND ALL TIME</td>
                  <td className="px-3 py-2">Includes World + regional</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtM(allTimeAll.e)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtM(allTimeAll.m)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtM(allTimeAll.t)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">100.00%</td>
                </tr>
                {sortedTable.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: NAVY_BORDER, color: INK_MUTED }}
                  >
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setPick(r.id)}
                        className="text-left hover:underline"
                        style={{ color: pick === r.id ? COL_ECON : INK }}
                      >
                        {r.n}
                      </button>
                    </td>
                    <td className="px-3 py-2">{r.r}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtM(r.e)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtM(r.m)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtM(r.e + r.m)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.pct.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="border-t pt-4 text-xs leading-relaxed" style={{ borderColor: NAVY_BORDER, color: INK_DIM }}>
          <p className="font-semibold" style={{ color: INK_MUTED }}>
            Methodology
          </p>
          <p className="mt-2">{SOURCE_NOTE}</p>
          <p className="mt-2">
            Modern comparable US aid accounting starts in FY1946 (Greenbook / Foreign Assistance Act
            series). Amounts are obligations, not disbursements. Military follows the official
            economic/military objective; inflation uses the USAID GDP-deflator series rebased to
            FY2025 = 1.00. FY2026 partial rows are excluded. Source: ForeignAssistance.gov, August
            2026 extract.
          </p>
        </div>
      </div>
    </div>
  );
}
