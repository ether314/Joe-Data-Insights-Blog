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
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COUNTRY_PROFILES,
  DEPENDENCY_PATH,
  FLOW_COMPARE,
  HEADLINE,
  REMITTANCE_SERIES,
  ROLE_COLORS,
  SOURCE_NOTE,
  SOURCES,
  TOP_CORRIDORS,
  US_EMPLOYMENT_INDEX,
  fmtBn,
  fmtPct,
  rankedByPensionSpend,
  rankedByRemittanceGdp,
  rankedByRemittanceIn,
  scatterPoints,
  type CountryRole,
} from "@/data/demographic-cash-flows-research-2026-data";

// viz-types: dependency×remittance scatter, cohort dependency lines, remittance area + employment dual-line, ranked GDP-share bars, corridor bars, flow compare | layout: canvas

type Panel = "scatter" | "aging" | "dependence" | "corridors" | "engines";

type RankMetric = "gdp-share" | "inflow" | "pension";

type RoleFilter = "all" | CountryRole;

const DEP_COLORS = {
  japan: "#0f766e",
  italy: "#7c3aed",
  germany: "#2563eb",
  unitedStates: "#0891b2",
  mexico: "#ea580c",
  india: "#dc2626",
  nigeria: "#ca8a04",
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
                ? "bg-teal-900 text-white"
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

function GenericTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label != null && <p className="mb-1 font-semibold text-slate-800">{label}</p>}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600">
          <span style={{ color: p.color }}>{p.name ?? p.dataKey}</span>:{" "}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: ReturnType<typeof scatterPoints>[number] }[];
}) {
  if (!active || !payload?.[0]?.payload) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{d.label}</p>
      <p className="text-slate-600">Old-age dependency: {d.oldAgeDependency}</p>
      <p className="text-slate-600">Remittances / GDP: {fmtPct(d.y, 1)}</p>
      {d.remittanceInBn != null && (
        <p className="text-slate-600">Inflow: {fmtBn(d.remittanceInBn)}</p>
      )}
      {d.publicPensionGdpPct != null && (
        <p className="text-slate-600">Public pensions: {fmtPct(d.publicPensionGdpPct, 1)} GDP</p>
      )}
    </div>
  );
}

export function DemographicCashFlowsResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("scatter");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [rankMetric, setRankMetric] = useState<RankMetric>("gdp-share");
  const [showHosts, setShowHosts] = useState(true);
  const [showOrigins, setShowOrigins] = useState(true);

  const scatter = useMemo(() => {
    let pts = scatterPoints();
    if (roleFilter !== "all") pts = pts.filter((p) => p.role === roleFilter);
    return pts;
  }, [roleFilter]);

  const rankedBars = useMemo(() => {
    const rows =
      rankMetric === "gdp-share"
        ? rankedByRemittanceGdp()
        : rankMetric === "inflow"
          ? rankedByRemittanceIn()
          : rankedByPensionSpend();
    return rows.slice(0, 10).map((r) => ({
      name: r.shortLabel,
      value:
        rankMetric === "gdp-share"
          ? (r.remittanceGdpPct ?? 0)
          : rankMetric === "inflow"
            ? (r.remittanceInBn ?? 0)
            : (r.publicPensionGdpPct ?? 0),
      fill: ROLE_COLORS[r.role],
    }));
  }, [rankMetric]);

  const corridorBars = useMemo(
    () =>
      [...TOP_CORRIDORS]
        .sort((a, b) => b.bn - a.bn)
        .map((c) => ({
          name: `${c.from.split(" ")[0]}→${c.to}`,
          bn: c.bn,
        })),
    [],
  );

  const remitArea = useMemo(
    () => REMITTANCE_SERIES.map((r) => ({ year: r.year, bn: r.lmicBn })),
    [],
  );

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border border-teal-900/20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-200/80">
          Demographic cash flows — age, migration, and money
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Working-age migrants fund two ledgers: host pensions and origin remittances
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-teal-50/85">
          LMIC remittances hit {fmtBn(HEADLINE.lmicRemittances2024Bn)} in 2024 (+
          {HEADLINE.remittanceGrowth2024Pct}%). Italy&apos;s public pensions run ~
          {fmtPct(HEADLINE.italyPensionGdpPct, 1)} of GDP while Tajikistan&apos;s remittances
          equal ~{fmtPct(HEADLINE.tajikistanRemitGdpPct)} of GDP — opposite ends of the same
          age–migration money map.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-teal-100/90">
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Japan OADR {HEADLINE.japanOldAgeDep} vs Nigeria {HEADLINE.nigeriaOldAgeDep}
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            US→Mexico corridor {fmtBn(HEADLINE.topCorridorUsMxBn)}
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Remittances &gt; FDI ({fmtBn(HEADLINE.fdiCompareBn)}) &amp; ODA (
            {fmtBn(HEADLINE.odaCompareBn)})
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "scatter", label: "Age × remittance map" },
            { id: "aging", label: "Aging paths" },
            { id: "dependence", label: "Dependence ranks" },
            { id: "corridors", label: "Corridors" },
            { id: "engines", label: "Flow engines" },
          ]}
        />
        {panel === "scatter" && (
          <ToggleGroup
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { id: "all", label: "All" },
              { id: "aging-host", label: "Aging hosts" },
              { id: "remittance-origin", label: "Origins" },
              { id: "bridge", label: "Bridges" },
            ]}
          />
        )}
        {panel === "dependence" && (
          <ToggleGroup
            label="Metric"
            value={rankMetric}
            onChange={setRankMetric}
            options={[
              { id: "gdp-share", label: "Remit / GDP" },
              { id: "inflow", label: "Inflow $" },
              { id: "pension", label: "Pension / GDP" },
            ]}
          />
        )}
        {panel === "aging" && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowHosts((v) => !v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                showHosts ? "bg-teal-900 text-white" : "border border-slate-200 text-slate-600"
              }`}
            >
              Hosts on/off
            </button>
            <button
              type="button"
              onClick={() => setShowOrigins((v) => !v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                showOrigins ? "bg-orange-700 text-white" : "border border-slate-200 text-slate-600"
              }`}
            >
              Origins on/off
            </button>
          </div>
        )}
      </div>

      {panel === "scatter" && (
        <ChartCard
          title="Old-age dependency vs remittance intensity"
          subtitle="Bubble size ≈ remittance inflow $. Aging hosts cluster lower-right; remittance-dependent origins upper-left."
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Old-age dependency"
                  unit=""
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Old-age dependency (65+ / 15–64 × 100)",
                    position: "insideBottom",
                    offset: -16,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Remit/GDP"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Remittances % GDP",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={scatter} name="Countries">
                  {scatter.map((p) => (
                    <Cell key={p.id} fill={ROLE_COLORS[p.role]} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {(Object.keys(ROLE_COLORS) as CountryRole[]).map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: ROLE_COLORS[r] }}
                />
                {r}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "aging" && (
        <ChartCard
          title="Old-age dependency paths (UN WPP)"
          subtitle="Hosts climb toward 50–70 by mid-century; young origin countries stay flat — the demographic wedge behind remittance demand."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DEPENDENCY_PATH} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<GenericTooltip />} />
                {showHosts && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="japan"
                      name="Japan"
                      stroke={DEP_COLORS.japan}
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="italy"
                      name="Italy"
                      stroke={DEP_COLORS.italy}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="germany"
                      name="Germany"
                      stroke={DEP_COLORS.germany}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="unitedStates"
                      name="US"
                      stroke={DEP_COLORS.unitedStates}
                      strokeWidth={2}
                      dot={false}
                    />
                  </>
                )}
                {showOrigins && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="mexico"
                      name="Mexico"
                      stroke={DEP_COLORS.mexico}
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="india"
                      name="India"
                      stroke={DEP_COLORS.india}
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="nigeria"
                      name="Nigeria"
                      stroke={DEP_COLORS.nigeria}
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      dot={false}
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "dependence" && (
        <ChartCard
          title={
            rankMetric === "gdp-share"
              ? "Remittance dependence (% of GDP)"
              : rankMetric === "inflow"
                ? "Largest remittance inflows ($bn)"
                : "Public pension spending (% of GDP)"
          }
          subtitle="Toggle metric: GDP-share vulnerability ≠ dollar volume ≠ host pension fiscal load."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankedBars}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                <Tooltip content={<GenericTooltip />} />
                <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]}>
                  {rankedBars.map((r) => (
                    <Cell key={r.name} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "corridors" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Top bilateral remittance corridors"
            subtitle="KNOMAD bilateral matrix — country-pair dollars, not recipient totals."
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={corridorBars} margin={{ top: 8, right: 8, bottom: 48, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-32}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="bn" name="$bn" fill="#0f766e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="External finance to LMICs (2024)"
            subtitle="Remittances outpace FDI and more than triple ODA in Brief 41 comparisons."
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FLOW_COMPARE} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="bn" name="$bn" radius={[4, 4, 0, 0]}>
                    {FLOW_COMPARE.map((f) => (
                      <Cell
                        key={f.id}
                        fill={f.id === "remit" ? "#0f766e" : f.id === "fdi" ? "#64748b" : "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "engines" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="LMIC remittance totals"
            subtitle="Officially recorded inflows — informal channels mean true flows are larger."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={remitArea} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<GenericTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="bn"
                    name="$bn"
                    stroke="#0f766e"
                    fill="#14b8a6"
                    fillOpacity={0.35}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="US employment index (Feb 2020 = 100)"
            subtitle="Foreign-born employment recovered above pre-pandemic; native-born returned to flat — a remittance engine for LAC corridors."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={US_EMPLOYMENT_INDEX}
                  margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis domain={[90, 115]} tick={{ fontSize: 11 }} />
                  <Tooltip content={<GenericTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="foreignBorn"
                    name="Foreign-born"
                    stroke="#c2410c"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="nativeBorn"
                    name="Native-born"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.href}>
            {i > 0 && " · "}
            <a href={s.href} className="underline hover:text-slate-700" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
        . Sample covers {COUNTRY_PROFILES.length} profiled economies.
      </p>
    </div>
  );
}
