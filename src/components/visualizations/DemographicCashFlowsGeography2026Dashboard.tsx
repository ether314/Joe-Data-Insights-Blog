"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CORRIDOR_BLOCS,
  DEPENDENCE_GEO,
  HEADLINE,
  HOST_AGE_BURDENS,
  HOST_BLOCS,
  METER_COMPARE,
  REGION_RECIPIENTS,
  SOURCE_NOTE,
  dependenceScatter,
  fmtPct,
  fmtUsdBn,
  hostAgeScatter,
} from "@/data/demographic-cash-flows-geography-2026-data";

// viz-types: recipient region bars+pie, host origin bars, corridor bloc ladder, dependence×age scatter, host pension scatter, meter compare | layout: default

type ViewId = "destinations" | "hosts" | "corridors" | "age";
type DestMetric = "dollars" | "share";
type HostFilter = "all" | "host" | "bridge";
type RegionFocus =
  | "all"
  | "South Asia"
  | "Latin America & Caribbean"
  | "East Asia & Pacific"
  | "Middle East & North Africa"
  | "Sub-Saharan Africa"
  | "Europe & Central Asia";

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

export function DemographicCashFlowsGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("destinations");
  const [destMetric, setDestMetric] = useState<DestMetric>("share");
  const [hostFilter, setHostFilter] = useState<HostFilter>("all");
  const [regionFocus, setRegionFocus] = useState<RegionFocus>("all");

  const destBars = useMemo(() => {
    const rows = [...REGION_RECIPIENTS].filter((r) => r.short !== "Residual");
    if (destMetric === "dollars") {
      return rows.sort((a, b) => b.amountBn - a.amountBn);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [destMetric]);

  const destPie = useMemo(
    () =>
      REGION_RECIPIENTS.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  const hostBars = useMemo(() => {
    let rows = [...HOST_BLOCS];
    if (hostFilter === "host") rows = rows.filter((h) => h.role === "host");
    if (hostFilter === "bridge") rows = rows.filter((h) => h.role === "bridge");
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [hostFilter]);

  const corridorBars = useMemo(
    () => [...CORRIDOR_BLOCS].sort((a, b) => b.shareOfLmicPct - a.shareOfLmicPct),
    [],
  );

  const depScatter = useMemo(() => {
    const all = dependenceScatter();
    if (regionFocus === "all") return all;
    return all.filter((d) => d.region === regionFocus);
  }, [regionFocus]);

  const ageScatter = useMemo(() => hostAgeScatter(), []);

  const meters = useMemo(() => METER_COMPARE, []);

  return (
    <div
      className="space-y-6"
      data-viz="demographic-cash-flows-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Demographic cash flows — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where remittance dollars and age risk sit on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          {HEADLINE.top1RegionLabel} takes ~{HEADLINE.top1RegionSharePct}% of
          the ${HEADLINE.lmicUniverseBn}B LMIC remittance perimeter; the{" "}
          {HEADLINE.top1HostLabel} hosts ~{HEADLINE.usHostSharePct}% of
          estimated outbound origin; {HEADLINE.top1CorridorBlocLabel} is the
          largest corridor bloc (~{HEADLINE.top1CorridorBlocSharePct}%) — while
          extreme GDP dependence still clusters in small Central Asian and
          Central American economies, not the dollar giants.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "S. Asia recipient $",
              value: fmtPct(HEADLINE.top1RegionSharePct),
            },
            {
              label: "US host origin",
              value: fmtPct(HEADLINE.usHostSharePct),
            },
            {
              label: "US→LatAm bloc",
              value: fmtPct(HEADLINE.top1CorridorBlocSharePct),
            },
            {
              label: "TJ remittance/GDP",
              value: fmtPct(HEADLINE.top1DependenceGdpPct),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "destinations", label: "Destinations" },
            { id: "hosts", label: "Hosts" },
            { id: "corridors", label: "Corridors" },
            { id: "age", label: "Age & risk" },
          ]}
        />
        {view === "destinations" && (
          <ToggleGroup
            label="Metric"
            value={destMetric}
            onChange={setDestMetric}
            options={[
              { id: "share", label: "Share %" },
              { id: "dollars", label: "Dollars" },
            ]}
          />
        )}
        {view === "hosts" && (
          <ToggleGroup
            label="Filter"
            value={hostFilter}
            onChange={setHostFilter}
            options={[
              { id: "all", label: "All" },
              { id: "host", label: "Hosts only" },
              { id: "bridge", label: "Residual" },
            ]}
          />
        )}
        {view === "age" && (
          <ToggleGroup
            label="Dependence region"
            value={regionFocus}
            onChange={setRegionFocus}
            options={[
              { id: "all", label: "All" },
              { id: "South Asia", label: "S. Asia" },
              { id: "Latin America & Caribbean", label: "LatAm" },
              { id: "East Asia & Pacific", label: "EAP" },
              { id: "Middle East & North Africa", label: "MENA" },
              { id: "Sub-Saharan Africa", label: "SSA" },
              { id: "Europe & Central Asia", label: "ECA" },
            ]}
          />
        )}
      </div>

      {view === "destinations" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Destination-region ladder"
            subtitle={
              destMetric === "dollars"
                ? "LMIC remittance inflows by destination region ($B)"
                : "Share of $685B Brief 41 LMIC perimeter"
            }
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={destBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={
                      destMetric === "dollars" ? [0, 200] : [0, 30]
                    }
                    tickFormatter={(v) =>
                      destMetric === "dollars" ? `$${v}B` : `${v}%`
                    }
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      destMetric === "dollars"
                        ? fmtUsdBn(Number(v), 0)
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar
                    dataKey={destMetric === "dollars" ? "amountBn" : "sharePct"}
                    radius={[0, 4, 4, 0]}
                  >
                    {destBars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Recipient geography pie"
            subtitle="Regional share of LMIC remittance dollars (incl. residual)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {destPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [fmtPct(Number(v), 1), "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {destPie.map((d) => (
                <span
                  key={d.name}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.fill }}
                  />
                  {d.name} {fmtPct(d.value, 1)}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "hosts" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Host / origin geography"
            subtitle="Estimated share of $685B outbound origin by host bloc"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hostBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 40]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={80}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      fmtPct(Number(v), 1),
                      (p?.payload as { bloc?: string })?.bloc ?? "Share",
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {hostBars.map((h) => (
                      <Cell key={h.bloc} fill={h.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Host age context"
            subtitle="Median old-age dependency of host blocs (UN WPP framing)"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...HOST_BLOCS]
                    .filter((h) => h.role === "host")
                    .sort((a, b) => b.medianOldAgeDep - a.medianOldAgeDep)}
                  margin={{ top: 8, right: 12, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Old-age dep.",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="medianOldAgeDep" radius={[4, 4, 0, 0]}>
                    {HOST_BLOCS.filter((h) => h.role === "host").map((h) => (
                      <Cell key={h.bloc} fill={h.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "corridors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Corridor-bloc ladder"
            subtitle="Regional pipes as share of $685B LMIC perimeter"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={corridorBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 14]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={100}
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 1), "Share"]}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { label?: string })?.label ??
                      ""
                    }
                  />
                  <Bar dataKey="shareOfLmicPct" radius={[0, 4, 4, 0]}>
                    {corridorBars.map((c) => (
                      <Cell key={c.id} fill={c.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Geography meters"
            subtitle="Recipient, host, corridor, and dependence on one strip"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meters}
                  margin={{ top: 8, right: 12, left: 8, bottom: 64 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      fmtPct(Number(v), 1),
                      (p?.payload as { meter?: string })?.meter ?? "Value",
                    ]}
                  />
                  <Bar dataKey="valuePct" radius={[4, 4, 0, 0]}>
                    {meters.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "age" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Dependence × age scatter"
            subtitle="X = remittance/GDP % · Y = old-age dependency · bubble ∝ √$B"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Remittance/GDP"
                    unit="%"
                    domain={[0, 50]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Remittance / GDP %",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Old-age dep."
                    domain={[0, 25]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Old-age dep.",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Remittance/GDP")
                        return [fmtPct(Number(v), 1), String(name)];
                      if (name === "Old-age dep.")
                        return [String(v), String(name)];
                      return [v, String(name)];
                    }}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { label?: string })?.label ??
                      ""
                    }
                  />
                  <Scatter data={depScatter}>
                    {depScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Showing {depScatter.length} of {DEPENDENCE_GEO.length} economies
              {regionFocus !== "all" ? ` in ${regionFocus}` : ""}. Dollar giants
              (IN, MX, CN) sit low on GDP dependence; TJ / Central America sit
              high on risk.
            </p>
          </ChartCard>

          <ChartCard
            title="Host pension × age"
            subtitle="Where aging public balance sheets sit among remittance hosts"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Old-age dep."
                    domain={[0, 60]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Old-age dependency",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Pension % GDP"
                    domain={[0, 18]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Public pension % GDP",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { label?: string })?.label ??
                      ""
                    }
                  />
                  <Scatter data={ageScatter}>
                    {ageScatter.map((h) => (
                      <Cell key={h.id} fill={h.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Italy {fmtPct(HEADLINE.italyPensionGdpPct, 1)} of GDP vs OECD avg ~{" "}
              {fmtPct(HEADLINE.oecdPensionAvgGdpPct, 1)}. GCC hosts are young;
              Europe is the aging public-pension tip. Bubble size tracks outbound
              remittance role ({HOST_AGE_BURDENS.length} hosts).
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
