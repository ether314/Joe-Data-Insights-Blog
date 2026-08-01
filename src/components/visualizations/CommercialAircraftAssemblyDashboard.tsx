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
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

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
            <div className="relative h-80 min-h-[280px] w-full overflow-hidden rounded-lg bg-slate-900">
              <svg
                viewBox="0 0 100 56"
                className="h-full w-full"
                role="img"
                aria-label="World map of commercial aircraft final assembly sites"
              >
                <rect width="100" height="56" fill="#0f172a" />
                <path
                  d="M8 18h12l3 4h8l2-3h10l4 6h6l-2 4h-8l-4 8H20l-4-6H8z"
                  fill="#1e293b"
                  opacity="0.9"
                />
                <path
                  d="M48 14h8l3 5h6l2 8h-6l-4 6h-8l-2-7z"
                  fill="#1e293b"
                  opacity="0.9"
                />
                <path
                  d="M68 20h14l4 6h8l-2 8H78l-6 4h-8l-2-8z"
                  fill="#1e293b"
                  opacity="0.85"
                />
                <path
                  d="M22 36h10l4 8H18z"
                  fill="#1e293b"
                  opacity="0.8"
                />
                {sites.map((s) => {
                  const { x, y } = project(s.lon, s.lat);
                  const r = 1.2 + s.falLines * 0.55;
                  const active = hoverId === s.id;
                  return (
                    <g
                      key={s.id}
                      onMouseEnter={() => setHoverId(s.id)}
                      onMouseLeave={() => setHoverId(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={x * 0.92 + 4}
                        cy={y * 0.5 + 4}
                        r={r}
                        fill={OEM_COLOR[s.oem]}
                        opacity={active ? 1 : 0.85}
                        stroke="#fff"
                        strokeWidth={active ? 0.4 : 0.2}
                      />
                    </g>
                  );
                })}
              </svg>
              {hoverSite && (
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md border border-slate-600 bg-slate-950/95 px-3 py-2 text-xs text-slate-100">
                  <div className="font-semibold">
                    {hoverSite.city}, {hoverSite.country}
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
