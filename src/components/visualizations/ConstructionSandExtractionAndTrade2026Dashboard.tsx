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
  CORRIDORS,
  HEADLINE,
  REGION_DEMAND,
  SINGAPORE_PARTNERS,
  SOURCE_NOTE,
  US_END_USE,
  dependenceScatter,
  extractorBars,
  fmtMt,
  fmtPct,
  importerBars,
  regionHhi,
  usPathComposed,
} from "@/data/construction-sand-extraction-and-trade-2026-data";

// viz-types: extractor bars, region donut, US composed volume+price, importer bars, partner pie, dependence scatter, corridor bars | layout: default

type ViewId = "extractors" | "importers" | "city" | "uspath";
type ExtractorLens = "all" | "disclosed" | "mfa";
type ImporterMode = "tonnage" | "city" | "all";

const SAND = "#b45309";
const NAVY = "#0f172a";
const TEAL = "#0f766e";
const SLATE = "#64748b";
const PIE_COLORS = ["#b45309", "#0f766e", "#0369a1", "#7c3aed", "#be123c", "#64748b"];

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

export function ConstructionSandExtractionAndTrade2026Dashboard() {
  const [view, setView] = useState<ViewId>("extractors");
  const [extractorLens, setExtractorLens] = useState<ExtractorLens>("all");
  const [importerMode, setImporterMode] = useState<ImporterMode>("tonnage");

  const extractors = useMemo(
    () =>
      extractorBars(extractorLens).map((e) => ({
        name: e.label,
        mt: e.mt,
        confidence: e.confidence,
      })),
    [extractorLens],
  );
  const importers = useMemo(
    () =>
      importerBars(importerMode).map((r) => ({
        name: r.label,
        mt: r.mt as number,
        cityState: r.cityState,
      })),
    [importerMode],
  );
  const regions = useMemo(
    () => REGION_DEMAND.map((r) => ({ name: r.label, value: r.sharePct })),
    [],
  );
  const partners = useMemo(
    () => SINGAPORE_PARTNERS.map((p) => ({ name: p.label, value: p.sharePct })),
    [],
  );
  const usPath = useMemo(() => usPathComposed(), []);
  const scatter = useMemo(() => dependenceScatter(), []);
  const endUse = useMemo(() => US_END_USE, []);
  const corridors = useMemo(
    () =>
      CORRIDORS.map((c) => ({
        name: `${c.from.split(/[\s/]/)[0]}→${c.to.split(/[\s/]/)[0]}`,
        intensity: c.intensity,
      })),
    [],
  );
  const hhi = useMemo(() => regionHhi(), []);

  return (
    <div
      className="space-y-6"
      data-viz="construction-sand-extraction-and-trade-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Construction aggregates · sand extraction & trade
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Singapore holds ~{fmtPct(HEADLINE.singaporeTop10ImportSharePct, 0)} of
          top-10 disclosed sand imports — China MFA ~{fmtMt(HEADLINE.chinaMfaSandMt, 1)}{" "}
          vs US MCS {fmtMt(HEADLINE.usUsgsMt2025, 0)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          UNEP frames global sand resources near {HEADLINE.unepGlobalGtLow}–
          {HEADLINE.unepGlobalGtHigh} Gt/yr. USGS publishes a full US construction
          sand & gravel series ({HEADLINE.usUsgsMt2025} Mt in 2025e) but no world
          total. On the trade side, Singapore&apos;s {HEADLINE.singaporeImportMt2023}{" "}
          Mt of HS 2505.90 imports in 2023 exceeds Belgium + Netherlands + US
          combined among quantity reporters.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "UNEP mid estimate",
              value: `${HEADLINE.unepGlobalGtMid} Gt/yr`,
            },
            {
              label: "China MFA sand use",
              value: fmtMt(HEADLINE.chinaMfaSandMt, 1),
            },
            {
              label: "US MCS 2025e",
              value: fmtMt(HEADLINE.usUsgsMt2025, 0),
            },
            {
              label: "SG import share (top-10)",
              value: fmtPct(HEADLINE.singaporeTop10ImportSharePct, 0),
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
            { id: "extractors", label: "Extractors" },
            { id: "importers", label: "Importers" },
            { id: "city", label: "City-states" },
            { id: "uspath", label: "US MCS path" },
          ]}
        />
        {view === "extractors" && (
          <ToggleGroup
            label="Lens"
            value={extractorLens}
            onChange={setExtractorLens}
            options={[
              { id: "all", label: "All series" },
              { id: "disclosed", label: "Disclosed only" },
              { id: "mfa", label: "MFA giants" },
            ]}
          />
        )}
        {view === "importers" && (
          <ToggleGroup
            label="Filter"
            value={importerMode}
            onChange={setImporterMode}
            options={[
              { id: "tonnage", label: "Top tonnage" },
              { id: "city", label: "City-state only" },
              { id: "all", label: "All listed" },
            ]}
          />
        )}
      </div>

      {view === "extractors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Reported / estimated extraction"
            subtitle="Mt · MFA sand use vs USGS / UEPG sand & gravel (mixed metrics — see caveats)"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={extractors} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => fmtMt(Number(v), 0)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="mt" radius={[0, 4, 4, 0]}>
                    {extractors.map((row, i) => (
                      <Cell
                        key={row.name}
                        fill={
                          row.confidence === "disclosed"
                            ? TEAL
                            : i === 0
                              ? SAND
                              : SLATE
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regional demand vs UNEP mid envelope"
            subtitle={`Desk buckets of ~${HEADLINE.unepGlobalGtMid} Gt · analytical HHI ${hhi.toLocaleString()}`}
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regions}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={108}
                    paddingAngle={2}
                  >
                    {regions.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 1)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "importers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HS 2505.90 natural sand imports (2023)"
            subtitle="UN Comtrade / WITS quantity reporters · Mt"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={importers} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={92}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => `${Number(v).toFixed(2)} Mt`}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="mt" radius={[0, 4, 4, 0]}>
                    {importers.map((row) => (
                      <Cell
                        key={row.name}
                        fill={row.cityState ? SAND : TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Singapore partner mix (2023)"
            subtitle="Nearly all disclosed tonnage from Malaysia"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={partners}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, value }) =>
                      Number(value) > 1 ? `${name} ${fmtPct(Number(value), 0)}` : ""
                    }
                  >
                    {partners.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 2)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "city" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="City-state fill dependence"
            subtitle="X = disclosed 2023 import Mt (log-ish scale) · Y = desk dependence score"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Import Mt"
                    scale="log"
                    domain={[0.001, 40]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Import Mt (log)",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Dependence"
                    domain={[60, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "x"
                        ? `${Number(v).toFixed(2)} Mt`
                        : name === "y"
                          ? `score ${v}`
                          : v
                    }
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Scatter data={scatter} fill={SAND}>
                    {scatter.map((p) => (
                      <Cell key={p.id} fill={p.id === "sg" ? SAND : TEAL} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Fill / cross-border corridor intensity"
            subtitle="Analytical scores · not official trade weights"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={corridors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={56} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="intensity" fill={NAVY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "uspath" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US construction sand & gravel (USGS MCS)"
            subtitle="Sold or used by producers · Mt + average unit value ($/t)"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={usPath}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    domain={[800, 1000]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[10, 16]}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="mt"
                    name="Mt sold/used"
                    fill="#fef3c7"
                    stroke={SAND}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="priceProxy"
                    name="$/t unit value"
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="US end-use mix (2025e)"
            subtitle="USGS MCS construction sand & gravel"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={endUse}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {endUse.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 0)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
