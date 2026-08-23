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
  DOSAGE_FORM_MIX,
  DURATION_BANDS,
  GEO_INJECTABLE,
  HEADLINE,
  MANUFACTURER_LADDER,
  SHORTAGE_PATH,
  SITE_EXPOSURE,
  SITE_REDUNDANCY,
  SOURCE_NOTE,
  THERAPY_STRESS,
  UPSTREAM_FLAGS,
  fmtNum,
  fmtPct,
} from "@/data/us-generic-sterile-injectable-shortages-2026-data";

// viz-types: dosage donut, shortage area+line, site redundancy bars, maker ladder, geo scatter, duration stacked, therapy stress, upstream flags | layout: default

type ViewId = "dosage" | "path" | "sites" | "makers" | "geo";
type PathMetric = "ashp" | "injectable_share" | "both";
type SiteMetric = "share" | "count_index";
type GeoMetric = "volume" | "shortage" | "gap";

const INJ = "#0e7490";
const ORAL = "#64748b";
const OTHER = "#94a3b8";
const WARN = "#b45309";
const DANGER = "#be123c";
const TEAL = "#0f766e";
const NAVY = "#1e3a5f";
const PIE_COLORS = [INJ, ORAL, OTHER];
const SITE_COLORS = [DANGER, WARN, TEAL];

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

export function UsGenericSterileInjectableShortages2026Dashboard() {
  const [view, setView] = useState<ViewId>("dosage");
  const [pathMetric, setPathMetric] = useState<PathMetric>("both");
  const [siteMetric, setSiteMetric] = useState<SiteMetric>("share");
  const [geoMetric, setGeoMetric] = useState<GeoMetric>("gap");

  const siteBars = useMemo(
    () =>
      SITE_REDUNDANCY.map((r) => ({
        ...r,
        display:
          siteMetric === "share"
            ? r.sharePct
            : Math.round((r.sharePct / 100) * HEADLINE.ashpActiveQ2_2026),
      })),
    [siteMetric],
  );

  const geoScatter = useMemo(
    () =>
      GEO_INJECTABLE.map((g) => ({
        ...g,
        gap: g.shortageVolumeSharePct - g.volumeSharePct,
        z: Math.abs(g.shortageVolumeSharePct - g.volumeSharePct) + 8,
      })),
    [],
  );

  const geoBars = useMemo(() => {
    return GEO_INJECTABLE.map((g) => ({
      label: g.label,
      value:
        geoMetric === "volume"
          ? g.volumeSharePct
          : geoMetric === "shortage"
            ? g.shortageVolumeSharePct
            : g.shortageVolumeSharePct - g.volumeSharePct,
    }));
  }, [geoMetric]);

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-5 text-white sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
          Sterile injectables · shortage share
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          {HEADLINE.injectableSharePct}% of USP-mapped active shortages are
          sterile injectables
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          End-2025 USP map: {HEADLINE.uspActiveEnd2025} active shortages (
          ≈{HEADLINE.uspInjectablesApprox} injectables). ASHP molecule tally
          sits at {fmtNum(HEADLINE.ashpActiveQ2_2026)} in Q2 2026 —{" "}
          {HEADLINE.soleSourceNew2026Pct}% of new 2026 shortages are
          sole-source. One plant (Rocky Mount) still anchors ~
          {HEADLINE.rockyMountUsHospitalSiPct}% of US hospital sterile-injectable
          volume.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "dosage", label: "Dosage mix" },
            { id: "path", label: "Shortage path" },
            { id: "sites", label: "Site depth" },
            { id: "makers", label: "Makers" },
            { id: "geo", label: "Geography" },
          ]}
        />
        {view === "path" && (
          <ToggleGroup
            label="Metric"
            value={pathMetric}
            onChange={setPathMetric}
            options={[
              { id: "both", label: "Both" },
              { id: "ashp", label: "ASHP count" },
              { id: "injectable_share", label: "Injectable %" },
            ]}
          />
        )}
        {view === "sites" && (
          <ToggleGroup
            label="Units"
            value={siteMetric}
            onChange={setSiteMetric}
            options={[
              { id: "share", label: "Share %" },
              { id: "count_index", label: "Index on ASHP" },
            ]}
          />
        )}
        {view === "geo" && (
          <ToggleGroup
            label="Lens"
            value={geoMetric}
            onChange={setGeoMetric}
            options={[
              { id: "gap", label: "Shortage − volume" },
              { id: "volume", label: "Volume share" },
              { id: "shortage", label: "Shortage share" },
            ]}
          />
        )}
      </div>

      {view === "dosage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Dosage form of active shortages"
            subtitle="USP-mapped active shortages at end-2025 (n=75)"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DOSAGE_FORM_MIX}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={2}
                  >
                    {DOSAGE_FORM_MIX.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v))}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="How long shortages last"
            subtitle={`Average duration ${HEADLINE.avgDurationYears} years (was ${HEADLINE.avgDurationYears2024} in 2024)`}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DURATION_BANDS} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={88}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="sharePct" name="Share" radius={[0, 6, 6, 0]}>
                    {DURATION_BANDS.map((d) => (
                      <Cell
                        key={d.id}
                        fill={
                          d.id === "over5"
                            ? DANGER
                            : d.id === "3to5"
                              ? WARN
                              : TEAL
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Hospital therapy stress (index)"
            subtitle="Analytical stress index — not FDA severity grades"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={THERAPY_STRESS} margin={{ bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    tick={{ fontSize: 11 }}
                    height={60}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="stressIndex" name="Stress index" fill={INJ} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Upstream concentration flags"
            subtitle="KSM single-country risk on shortage vs vulnerable lists"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={UPSTREAM_FLAGS} layout="vertical" margin={{ left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" domain={[0, 80]} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={168}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="valuePct" name="Share" fill={NAVY} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-6">
          <ChartCard
            title="Active shortages vs injectable share"
            subtitle="ASHP molecule counts (left) · USP injectable share of mapped shortages (right)"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={SHORTAGE_PATH} margin={{ top: 8, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={56} />
                  {(pathMetric === "ashp" || pathMetric === "both") && (
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      label={{ value: "ASHP active", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                    />
                  )}
                  {(pathMetric === "injectable_share" || pathMetric === "both") && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[55, 75]}
                      tick={{ fontSize: 12 }}
                      unit="%"
                      label={{ value: "Injectable %", angle: 90, position: "insideRight", style: { fontSize: 11 } }}
                    />
                  )}
                  <Tooltip />
                  <Legend />
                  {(pathMetric === "ashp" || pathMetric === "both") && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="ashpActive"
                      name="ASHP active"
                      fill="#cffafe"
                      stroke={INJ}
                      strokeWidth={2}
                    />
                  )}
                  {(pathMetric === "injectable_share" || pathMetric === "both") && (
                    <Line
                      yAxisId={pathMetric === "injectable_share" ? "right" : "right"}
                      type="monotone"
                      dataKey="injectableSharePct"
                      name="Injectable share %"
                      stroke={WARN}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "sites" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="How many manufacturers stand behind new shortages?"
            subtitle={`ASHP: ${HEADLINE.soleSourceNew2026Pct}% of new 2026 shortages are sole-source`}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={siteBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    unit={siteMetric === "share" ? "%" : undefined}
                  />
                  <Tooltip
                    formatter={(v) =>
                      siteMetric === "share" ? fmtPct(Number(v)) : fmtNum(Number(v))
                    }
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.sitesLabel ?? ""
                    }
                  />
                  <Bar dataKey="display" name={siteMetric === "share" ? "Share" : "Indexed count"} radius={[6, 6, 0, 0]}>
                    {siteBars.map((s, i) => (
                      <Cell key={s.id} fill={SITE_COLORS[i % SITE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Single-site exposure facts"
            subtitle="Disclosed capacity / sole-source anchors"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SITE_EXPOSURE.filter((s) => s.unit === "%")} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" domain={[0, 55]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="value" name="Share" fill={DANGER} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "makers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Manufacturer ladder (active presentation entries)"
            subtitle="Desk roll-up of major sterile-injectable labels in FDA shortage registry summaries"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MANUFACTURER_LADDER} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => fmtNum(Number(v))} />
                  <Bar dataKey="activeEntries" name="Active entries" fill={INJ} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Top-3 share of ladder"
            subtitle={`Hospira + Fresenius + Hikma ≈ ${fmtNum(HEADLINE.top3MfrActiveEntries)} entries`}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MANUFACTURER_LADDER}
                    dataKey="activeEntries"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={96}
                  >
                    {MANUFACTURER_LADDER.map((_, i) => (
                      <Cell
                        key={i}
                        fill={[INJ, WARN, NAVY][i % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtNum(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "geo" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Injectable volume vs shortage volume"
            subtitle="USP geography of finished-dose injectable manufacturing"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="volumeSharePct"
                    name="Volume %"
                    unit="%"
                    domain={[0, 60]}
                    tick={{ fontSize: 12 }}
                    label={{ value: "Volume share", position: "insideBottom", offset: -2, style: { fontSize: 11 } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="shortageVolumeSharePct"
                    name="Shortage %"
                    unit="%"
                    domain={[0, 65]}
                    tick={{ fontSize: 12 }}
                    label={{ value: "Shortage volume share", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [fmtPct(Number(v)), String(name)]}
                    labelFormatter={() => ""}
                    content={({ payload }) => {
                      const p = payload?.[0]?.payload;
                      if (!p) return null;
                      return (
                        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <div className="font-semibold">{p.label}</div>
                          <div>Volume {fmtPct(p.volumeSharePct)}</div>
                          <div>Shortage volume {fmtPct(p.shortageVolumeSharePct)}</div>
                          <div>Gap {p.gap > 0 ? "+" : ""}{fmtPct(p.gap)}</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={geoScatter} fill={INJ}>
                    {geoScatter.map((g) => (
                      <Cell
                        key={g.id}
                        fill={g.gap > 0 ? DANGER : TEAL}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title={
              geoMetric === "gap"
                ? "Shortage share minus volume share"
                : geoMetric === "volume"
                  ? "Injectable volume share"
                  : "Injectable shortage-volume share"
            }
            subtitle="Positive gap = over-represented in shortage volume relative to production"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="value" name="Share" radius={[6, 6, 0, 0]}>
                    {geoBars.map((g, i) => (
                      <Cell
                        key={i}
                        fill={
                          geoMetric === "gap"
                            ? g.value > 0
                              ? DANGER
                              : TEAL
                            : INJ
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
