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
  HEADLINE,
  ORIGIN_SHARE_PATH,
  PORT_VS_ORIGIN,
  SOURCE_NOTE,
  balanceFor,
  cumulativeFor,
  destinationBars,
  fmtMt,
  fmtPct,
  originBars,
  originHhi,
  portsFor,
  type CropId,
} from "@/data/corn-and-soybean-export-chokepoints-2026-data";

// viz-types: origin bars+dest pie, cumulative area, port bars, balance stacks, share-path multi-line, port×origin scatter | layout: default

type ViewId = "origins" | "ports" | "balance" | "path";

const CORN = "#ca8a04";
const SOY = "#15803d";
const NAVY = "#0f172a";
const TEAL = "#0f766e";
const SLATE = "#64748b";
const AMBER = "#d97706";
const PIE_COLORS = ["#ca8a04", "#15803d", "#0369a1", "#7c3aed", "#be123c", "#64748b", "#0f766e", "#b45309"];

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

export function CornAndSoybeanExportChokepoints2026Dashboard() {
  const [view, setView] = useState<ViewId>("origins");
  const [crop, setCrop] = useState<CropId>("soy");

  const accent = crop === "corn" ? CORN : SOY;
  const origins = useMemo(() => originBars(crop), [crop]);
  const destinations = useMemo(() => destinationBars(crop), [crop]);
  const cumulative = useMemo(() => cumulativeFor(crop), [crop]);
  const ports = useMemo(
    () =>
      portsFor(crop).map((p) => ({
        name: p.label.replace(/ \(.*/, ""),
        share: p.shareOfNationalExportsPct,
        mt: p.approxMt,
        country: p.country,
      })),
    [crop],
  );
  const balance = useMemo(
    () =>
      balanceFor(crop).map((b) => ({
        name: b.country.replace("United States", "US"),
        production: b.productionMt,
        domestic: b.domesticUseMt,
        exports: b.exportsMt,
        exportable: b.exportableSharePct,
      })),
    [crop],
  );
  const path = useMemo(() => ORIGIN_SHARE_PATH, []);
  const scatter = useMemo(
    () =>
      PORT_VS_ORIGIN.filter((r) => r.crop === crop).map((r) => ({
        name: r.port,
        x: r.originSharePct,
        y: r.portShareOfWorldCropPct,
        z: r.mt,
      })),
    [crop],
  );
  const hhiVal = useMemo(() => originHhi(crop), [crop]);
  const destPie = useMemo(
    () => destinations.map((d) => ({ name: d.label, value: d.sharePct })),
    [destinations],
  );

  const punch =
    crop === "soy"
      ? `Brazil alone ${fmtPct(HEADLINE.soyBrazilSharePct)} of world soybean exports; Brazil+US ${fmtPct(HEADLINE.soyTop2SharePct)}`
      : `US+Brazil+Argentina ${fmtPct(HEADLINE.cornTop3SharePct)} of world corn exports; Top-4 with Ukraine ${fmtPct(HEADLINE.cornTop4SharePct)}`;

  return (
    <div
      className="w-full min-w-0 space-y-6"
      data-viz="corn-and-soybean-export-chokepoints-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90">
          Staple crop markets · corn & soybean export chokepoints
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          Top-origin share: {punch}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          WASDE 2026/27 world corn exports ~{fmtMt(HEADLINE.worldCornExportsMt)} Mt · soybean
          exports ~{fmtMt(HEADLINE.worldSoyExportsMt)} Mt. Origin HHI (desk) ≈ {hhiVal}. Port
          shares are analytical — not WASDE line items.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "origins", label: "Origins" },
            { id: "ports", label: "Ports" },
            { id: "balance", label: "Exportable supply" },
            { id: "path", label: "Share path" },
          ]}
        />
        <ToggleGroup
          label="Crop"
          value={crop}
          onChange={setCrop}
          options={[
            { id: "soy", label: "Soybeans" },
            { id: "corn", label: "Corn" },
          ]}
        />
      </div>

      {view === "origins" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${crop === "soy" ? "Soybean" : "Corn"} export origins`}
            subtitle="WASDE 2026/27 export Mt · share of world trade"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={origins.map((o) => ({
                    name: o.label.replace("United States", "US"),
                    mt: o.mt,
                    share: o.sharePct,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit=" Mt" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, key) =>
                      key === "mt"
                        ? [`${fmtMt(Number(v))} Mt`, "Exports"]
                        : [fmtPct(Number(v)), "Share"]
                    }
                  />
                  <Bar dataKey="mt" fill={accent} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Import absorption"
            subtitle="Desk share of world import demand (PSD / COMTRADE framing)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={96}
                    paddingAngle={2}
                  >
                    {destPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "Share"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative Top-k origin share"
            subtitle="How fast concentration stacks as exporters are added"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cumulative.map((c) => ({
                    k: `Top-${c.k}`,
                    share: c.sharePct,
                    who: c.label,
                  }))}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="k" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Cumulative share"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.who
                        ? String(payload[0].payload.who)
                        : ""
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="share"
                    stroke={NAVY}
                    fill={accent}
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Port × origin concentration"
            subtitle="National origin share (x) vs port share of world crop (y)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Origin %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Port/world %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "z"
                        ? [`${fmtMt(Number(v))} Mt`, "Port flow"]
                        : [
                            fmtPct(Number(v)),
                            name === "x" ? "Origin share" : "Port/world",
                          ]
                    }
                    labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
                  />
                  <Scatter data={scatter} fill={TEAL} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ports" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Load-port chokepoints"
            subtitle="% of national (or complex) export tons through named corridor"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ports}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, key) =>
                      key === "share"
                        ? [fmtPct(Number(v)), "National share"]
                        : [`${fmtMt(Number(v))} Mt`, "Approx flow"]
                    }
                  />
                  <Bar dataKey="share" fill={AMBER} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Approximate corridor tonnage"
            subtitle="Desk Mt through each named chokepoint"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={ports}
                  margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, angle: -28, textAnchor: "end" }}
                    interval={0}
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} unit=" Mt" />
                  <Tooltip
                    formatter={(v) => [`${fmtMt(Number(v))} Mt`, "Flow"]}
                  />
                  <Bar dataKey="mt" fill={TEAL} radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="share"
                    stroke={NAVY}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    yAxisId={0}
                    hide
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              US Gulf ~{HEADLINE.gulfShareOfUsGrainExportsPct}% of US grain exports · Santos ~
              {HEADLINE.santosShareOfBrazilSoyExportsPct}% of Brazil soy · Ukrainian Black Sea ~
              {HEADLINE.blackSeaShareOfUkraineCornPct}% of Ukraine corn.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "balance" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Production · domestic use · exports"
            subtitle="WASDE-style balance framing (Mt) for top origins"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={balance}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="production" name="Production" stackId="a" fill={SLATE} />
                  <Bar dataKey="domestic" name="Domestic use" fill={NAVY} />
                  <Bar dataKey="exports" name="Exports" fill={accent} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Exportable share of production"
            subtitle="Exports ÷ production — how export-dependent the crop is"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={balance}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "Exportable"]} />
                  <Bar dataKey="exportable" fill={accent} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid grid-cols-1 gap-6">
          <ChartCard
            title="Top-origin export share path"
            subtitle="Marketing-year shares of world trade (WASDE-carried desk series)"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={path}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 70]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), ""]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {crop === "soy" ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="soyBrazilPct"
                        name="Brazil soy"
                        stroke={SOY}
                        fill={SOY}
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="soyUsPct"
                        name="US soy"
                        stroke={CORN}
                        fill={CORN}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <>
                      <Line
                        type="monotone"
                        dataKey="cornUsPct"
                        name="US corn"
                        stroke={CORN}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cornBrazilPct"
                        name="Brazil corn"
                        stroke={SOY}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cornArgentinaPct"
                        name="Argentina corn"
                        stroke={TEAL}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
