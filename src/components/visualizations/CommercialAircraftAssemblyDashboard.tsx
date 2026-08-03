"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AIRBUS_2025_BY_FAMILY,
  A320_RATE_PATH,
  BOEING_2025_BY_FAMILY,
  FAL_BY_COUNTRY,
  FAL_BY_REGION,
  FAL_SITES,
  HEADLINE,
  OEM_DELIVERIES_2025,
  SOURCE_NOTE,
  SOURCES,
  fmtN,
  fmtPct,
  rankedFalSites,
  type OemId,
} from "@/data/commercial-aircraft-assembly-data";

// viz-types: custom-svg-map, ranked-bar, region-pie, rate-area | layout: fullscreen

type Tab = "map" | "deliveries" | "capacity";
type OemFilter = "all" | OemId;

const OEM_COLOR: Record<OemId, string> = {
  airbus: "#0ea5e9",
  boeing: "#f59e0b",
  comac: "#f43f5e",
  embraer: "#a78bfa",
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

function project(lon: number, lat: number) {
  // Equirectangular into a padded viewBox (0–100 × 0–56)
  const x = 4 + ((lon + 180) / 360) * 92;
  const y = 4 + ((90 - lat) / 180) * 48;
  return { x, y };
}

/** Lightweight land silhouettes for FAL geography (not political boundaries). */
const LAND_PATHS = [
  // North America
  "M12 16c2-3 6-5 11-5 4 0 8 1 11 4 2 2 3 5 2 8-1 3-3 5-6 7-3 2-7 3-11 2-4-1-7-3-9-7-1-2-1-5 2-9z",
  // Central America bridge
  "M22 30c2 1 3 3 3 5 0 1-1 2-2 2s-2-1-2-2c0-2 0-4 1-5z",
  // South America
  "M24 34c3-1 6 0 8 3 2 3 2 7 1 11-1 3-3 6-6 7-3 1-5-1-6-4-1-4 0-8 1-12 0-2 1-4 2-5z",
  // Europe
  "M48 14c3-1 6 0 8 2 2 2 2 5 1 7-1 2-3 3-5 3-3 0-5-1-6-4-1-2 0-5 2-8z",
  // Africa
  "M48 26c3-1 7 0 10 3 2 3 3 7 2 11-1 4-4 7-8 8-3 0-5-2-6-5-1-4 0-8 1-12 0-2 1-4 1-5z",
  // Northern Asia / Russia belt
  "M56 12c6-2 14-2 22 0 5 1 9 3 10 6 0 2-2 3-5 3-6 0-12-1-18-1-5 0-9-1-10-3 0-2 0-4 1-5z",
  // East / SE Asia
  "M72 20c4-1 8 0 11 3 2 2 3 5 2 8-1 2-3 4-6 4-3 0-5-1-7-3-2-3-2-6-1-9 0-1 1-2 1-3z",
  // Australia
  "M78 38c3-1 7 0 9 2 2 2 2 5 0 7-2 2-5 2-8 1-2-1-3-3-3-5 0-2 1-4 2-5z",
] as const;

const OEM_LEGEND: { id: OemId; label: string }[] = [
  { id: "airbus", label: "Airbus" },
  { id: "boeing", label: "Boeing" },
  { id: "comac", label: "COMAC" },
  { id: "embraer", label: "Embraer" },
];

export function CommercialAircraftAssemblyDashboard() {
  const [tab, setTab] = useState<Tab>("map");
  const [oemFilter, setOemFilter] = useState<OemFilter>("all");
  const [familyOem, setFamilyOem] = useState<"airbus" | "boeing">("airbus");
  const [hoverId, setHoverId] = useState<string | null>(null);

  const sites = useMemo(() => {
    const ranked = rankedFalSites();
    if (oemFilter === "all") return ranked;
    return ranked.filter((s) => s.oem === oemFilter);
  }, [oemFilter]);

  const deliveries = useMemo(
    () => [...OEM_DELIVERIES_2025].sort((a, b) => b.deliveries - a.deliveries),
    [],
  );

  const countries = useMemo(
    () => [...FAL_BY_COUNTRY].sort((a, b) => b.lines - a.lines),
    [],
  );

  const regions = useMemo(
    () => [...FAL_BY_REGION].sort((a, b) => b.lines - a.lines),
    [],
  );

  const familyData = useMemo(() => {
    const rows =
      familyOem === "airbus" ? AIRBUS_2025_BY_FAMILY : BOEING_2025_BY_FAMILY;
    return [...rows].sort((a, b) => b.deliveries - a.deliveries);
  }, [familyOem]);

  const hoverSite = hoverId
    ? FAL_SITES.find((s) => s.id === hoverId) ?? null
    : null;

  return (
    <div data-viz className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Commercial aircraft final assembly — OEM footprints
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Airbus: {HEADLINE.airbusFalCount} FALs on {HEADLINE.airbusLocations}{" "}
          sites — Boeing stays inside the US
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          In 2025 Airbus delivered {fmtN(HEADLINE.airbusDeliveries2025)} jets and
          Boeing {fmtN(HEADLINE.boeingDeliveries2025)}. The deeper industrial
          story is geography: Airbus spreads final assembly across Europe,
          China, and the US; Boeing’s commercial FALs remain American.
        </p>
        <p className="mt-2 text-xs text-slate-400">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { id: "map", label: "Assembly map" },
            { id: "deliveries", label: "2025 deliveries" },
            { id: "capacity", label: "FAL capacity" },
          ]}
        />
        {tab === "map" && (
          <ToggleGroup
            label="OEM"
            value={oemFilter}
            onChange={setOemFilter}
            options={[
              { id: "all", label: "All" },
              { id: "airbus", label: "Airbus" },
              { id: "boeing", label: "Boeing" },
              { id: "comac", label: "COMAC" },
              { id: "embraer", label: "Embraer" },
            ]}
          />
        )}
        {tab === "deliveries" && (
          <ToggleGroup
            label="Family mix"
            value={familyOem}
            onChange={setFamilyOem}
            options={[
              { id: "airbus", label: "Airbus mix" },
              { id: "boeing", label: "Boeing mix" },
            ]}
          />
        )}
      </div>

      {tab === "map" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Final-assembly sites"
              subtitle="Dot size ∝ FAL lines at campus — hover for programs"
            >
            <div className="relative h-80 min-h-[280px] w-full overflow-hidden rounded-lg bg-slate-950">
              <svg
                viewBox="0 0 100 56"
                className="h-full w-full"
                role="img"
                aria-label="World map of commercial aircraft final assembly sites"
              >
                <defs>
                  <radialGradient id="fal-ocean" cx="50%" cy="40%" r="70%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>
                </defs>
                <rect width="100" height="56" fill="url(#fal-ocean)" />
                {/* Latitude / longitude guides */}
                {[14, 28, 42].map((y) => (
                  <line
                    key={`lat-${y}`}
                    x1="4"
                    x2="96"
                    y1={y}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="0.15"
                    strokeDasharray="0.8 0.8"
                    opacity="0.55"
                  />
                ))}
                {[20, 40, 60, 80].map((x) => (
                  <line
                    key={`lon-${x}`}
                    y1="4"
                    y2="52"
                    x1={x}
                    x2={x}
                    stroke="#334155"
                    strokeWidth="0.15"
                    strokeDasharray="0.8 0.8"
                    opacity="0.4"
                  />
                ))}
                {LAND_PATHS.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="0.25"
                    opacity="0.95"
                  />
                ))}
                {sites.map((s) => {
                  const { x, y } = project(s.lon, s.lat);
                  const r = 1.4 + s.falLines * 0.45;
                  const active = hoverId === s.id;
                  return (
                    <g
                      key={s.id}
                      onMouseEnter={() => setHoverId(s.id)}
                      onMouseLeave={() => setHoverId(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={r + 1.2}
                        fill={OEM_COLOR[s.oem]}
                        opacity={active ? 0.35 : 0.18}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={r}
                        fill={OEM_COLOR[s.oem]}
                        opacity={active ? 1 : 0.92}
                        stroke="#fff"
                        strokeWidth={active ? 0.45 : 0.25}
                      />
                      {(active || s.falLines >= 4) && (
                        <text
                          x={x}
                          y={y - r - 1.2}
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize="2.2"
                          fontWeight="600"
                          className="pointer-events-none"
                        >
                          {s.city}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
                {OEM_LEGEND.map((o) => (
                  <span
                    key={o.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-slate-200 ring-1 ring-white/10"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: OEM_COLOR[o.id] }}
                    />
                    {o.label}
                  </span>
                ))}
              </div>
              {hoverSite && (
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md border border-slate-600 bg-slate-950/95 px-3 py-2 text-xs text-slate-100">
                  <div className="font-semibold">
                    <span
                      className="mr-1.5 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: OEM_COLOR[hoverSite.oem] }}
                    />
                    {hoverSite.city}, {hoverSite.country}
                    <span className="ml-2 font-normal uppercase tracking-wide text-slate-400">
                      {hoverSite.oem}
                    </span>
                  </div>
                  <div>
                    {hoverSite.falLines} FAL line
                    {hoverSite.falLines === 1 ? "" : "s"} · {hoverSite.programs}
                  </div>
                </div>
              )}
            </div>
            </ChartCard>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ChartCard
              title="FAL lines by country"
              subtitle="Ranked highest → lowest across mapped campuses"
            >
              <div className="h-80 min-h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                  <BarChart
                    data={countries}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="country"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip formatter={(v) => [`${v} lines`, "FAL lines"]} />
                    <Bar dataKey="lines" name="FAL lines" radius={[0, 4, 4, 0]}>
                      {countries.map((c) => (
                        <Cell
                          key={c.country}
                          fill={
                            c.country === "United States"
                              ? "#f59e0b"
                              : c.country === "China"
                                ? "#f43f5e"
                                : c.country === "Brazil"
                                  ? "#a78bfa"
                                  : "#0ea5e9"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="Lines by region"
              subtitle="Europe still hosts the largest Airbus cluster"
            >
            <div className="h-72 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                <PieChart>
                  <Pie
                    data={regions}
                    dataKey="lines"
                    nameKey="region"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {regions.map((r, i) => (
                      <Cell
                        key={r.region}
                        fill={["#0ea5e9", "#f59e0b", "#f43f5e", "#a78bfa"][i % 4]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} lines`, "FAL lines"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "deliveries" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2025 commercial deliveries"
            subtitle="FlightGlobal year wrap — ranked highest → lowest"
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                <BarChart
                  data={deliveries}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="oem"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => [fmtN(Number(v)), "Deliveries"]} />
                  <Bar dataKey="deliveries" name="Deliveries" radius={[0, 4, 4, 0]}>
                    {deliveries.map((d) => (
                      <Cell key={d.oem} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={`${familyOem === "airbus" ? "Airbus" : "Boeing"} family mix, 2025`}
            subtitle="Single-aisle programs dominate both books"
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                <BarChart
                  data={familyData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="family"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [fmtN(Number(v)), "Deliveries"]} />
                  <Bar
                    dataKey="deliveries"
                    name="Deliveries"
                    fill={familyOem === "airbus" ? "#0ea5e9" : "#f59e0b"}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "capacity" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="A320 Family monthly rate path"
            subtitle="2027 target of 75/month is Airbus-disclosed; earlier years are ramp waypoints"
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                <AreaChart
                  data={A320_RATE_PATH}
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 90]}
                    tick={{ fontSize: 12 }}
                    width={36}
                    label={{ value: "Jets/month", angle: -90, position: "insideLeft", offset: 10 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${v}/mo (${(item?.payload as { quality?: string })?.quality ?? ""})`,
                      "Rate",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    name="Monthly rate"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Geography contrast"
            subtitle="Share of Airbus FAL lines outside Europe vs Boeing outside the US"
          >
            <div className="flex h-80 min-h-[280px] flex-col justify-center gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Airbus FAL lines outside Europe
                </div>
                <div className="mt-1 text-4xl font-bold tabular-nums text-sky-600">
                  {fmtPct((4 / HEADLINE.airbusFalCount) * 100, 0)}
                </div>
                <div className="text-sm text-slate-500">
                  4 of {HEADLINE.airbusFalCount} lines in Tianjin + Mobile
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Boeing commercial FAL lines outside the US
                </div>
                <div className="mt-1 text-4xl font-bold tabular-nums text-amber-600">
                  0%
                </div>
                <div className="text-sm text-slate-500">
                  Renton, Everett, and Charleston only
                </div>
              </div>
              <p className="text-xs text-slate-500">
                COMAC’s Shanghai C919 line and Embraer’s Brazilian E-Jet campus
                sit outside the duopoly — still tiny on 2025 delivery counts
                (C919: {HEADLINE.comacC919Deliveries2025}).
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        Sources: {SOURCES.join(" · ")}
      </p>
    </div>
  );
}
