"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
  AC_BUCKETS,
  CONCENTRATION_CURVE,
  CURRENCY_SPLITS,
  GLOBAL_SERIES,
  HEADLINE,
  LENS_COMPARE,
  REGION_RETREAT,
  SOURCE_NOTE,
  SOURCES,
  THIN_CORRIDORS,
  fmtPct,
} from "@/data/correspondent-banking-corridor-retreat-2026-data";

// viz-types: global AC/corridor/volume composed, regional retreat bars, thin-corridor scatter, AC-bucket pie, Lorenz area+line, currency decline bars | layout: default

type ViewId = "timeline" | "regions" | "thin" | "buckets" | "curve" | "currency";
type RegionMetric = "acDeclinePct" | "corridorDeclinePct";
type ThinAxis = "top3SharePct" | "top1SharePct" | "acDeclinePct";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const AMBER = "#f59e0b";
const EMERALD = "#10b981";

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

export function CorrespondentBankingCorridorRetreat2026Dashboard() {
  const [view, setView] = useState<ViewId>("timeline");
  const [regionMetric, setRegionMetric] =
    useState<RegionMetric>("acDeclinePct");
  const [thinY, setThinY] = useState<ThinAxis>("top3SharePct");
  const [bucketLens, setBucketLens] = useState<"corridorSharePct" | "volumeSharePct">(
    "corridorSharePct",
  );
  const [showVolume, setShowVolume] = useState(true);

  const regionBars = useMemo(() => {
    return [...REGION_RETREAT].sort(
      (a, b) => b[regionMetric] - a[regionMetric],
    );
  }, [regionMetric]);

  const thinScatter = useMemo(
    () =>
      THIN_CORRIDORS.map((c) => ({
        ...c,
        x: c.activeCorrespondents,
        y: c[thinY],
        z: Math.max(40, c.volumeSharePct * 80),
      })),
    [thinY],
  );

  const bucketPie = useMemo(
    () =>
      AC_BUCKETS.map((b) => ({
        name: b.short,
        value: b[bucketLens],
        fill: b.fill,
      })),
    [bucketLens],
  );

  const currencyBars = useMemo(
    () => [...CURRENCY_SPLITS].sort((a, b) => b.decline2018Pct - a.decline2018Pct),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="correspondent-banking-corridor-retreat-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
          Cross-border payments · correspondent retreat
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Active correspondent corridors
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Global active correspondents are down about{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.acDeclineSince2011Pct)}
          </span>{" "}
          since 2011 while corridors thinned roughly{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.corridorDeclineSince2011Pct)}
          </span>
          . Message volume rose — leaving thin corridors dependent on a handful
          of banks (median top-3 share{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.thinCorridorTop3SharePct)}
          </span>{" "}
          in the desk sample).
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LENS_COMPARE.map((l) => (
            <div
              key={l.id}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {l.short}
              </p>
              <p className="text-xl font-bold" style={{ color: l.fill }}>
                {l.value}
                {l.unit}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "timeline", label: "Network timeline" },
            { id: "regions", label: "Regional retreat" },
            { id: "thin", label: "Thin corridors" },
            { id: "buckets", label: "AC buckets" },
            { id: "curve", label: "Concentration curve" },
            { id: "currency", label: "Currency lens" },
          ]}
        />
        {view === "timeline" && (
          <ToggleGroup
            label="Volume line"
            value={showVolume ? "on" : "off"}
            onChange={(v) => setShowVolume(v === "on")}
            options={[
              { id: "on", label: "Show volume" },
              { id: "off", label: "Hide volume" },
            ]}
          />
        )}
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={regionMetric}
            onChange={setRegionMetric}
            options={[
              { id: "acDeclinePct", label: "AC decline" },
              { id: "corridorDeclinePct", label: "Corridor decline" },
            ]}
          />
        )}
        {view === "thin" && (
          <ToggleGroup
            label="Y-axis"
            value={thinY}
            onChange={setThinY}
            options={[
              { id: "top3SharePct", label: "Top-3 share" },
              { id: "top1SharePct", label: "Top-1 share" },
              { id: "acDeclinePct", label: "AC decline" },
            ]}
          />
        )}
        {view === "buckets" && (
          <ToggleGroup
            label="Slice"
            value={bucketLens}
            onChange={setBucketLens}
            options={[
              { id: "corridorSharePct", label: "Corridor share" },
              { id: "volumeSharePct", label: "Volume share" },
            ]}
          />
        )}
      </div>

      {view === "timeline" && (
        <ChartCard
          title="Network timeline"
          subtitle="Active correspondents and corridors fall while message volume rises (2011 = 100)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={GLOBAL_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[60, 180]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="acIndex"
                  name="Active correspondents"
                  fill={ROSE}
                  fillOpacity={0.15}
                  stroke={ROSE}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="corridorIndex"
                  name="Active corridors"
                  stroke={AMBER}
                  strokeWidth={2}
                  dot={false}
                />
                {showVolume && (
                  <Line
                    type="monotone"
                    dataKey="volumeIndex"
                    name="Message volume"
                    stroke={SKY}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "regions" && (
        <ChartCard
          title="Regional retreat"
          subtitle={
            regionMetric === "acDeclinePct"
              ? "Cumulative active-correspondent decline since 2011"
              : "Cumulative active-corridor decline since 2011"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={88}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey={regionMetric} name="Decline %" radius={[0, 4, 4, 0]}>
                  {regionBars.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "thin" && (
        <ChartCard
          title="Thin corridors"
          subtitle="Active correspondents (x) vs concentration / decline (y); bubble ≈ volume share"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Active correspondents"
                  tick={{ fontSize: 12 }}
                  domain={[0, 14]}
                  label={{
                    value: "Active correspondents",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={thinY}
                  tick={{ fontSize: 12 }}
                  unit="%"
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Corridors" data={thinScatter}>
                  {thinScatter.map((c) => (
                    <Cell key={c.id} fill={c.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {THIN_CORRIDORS.map((c) => (
              <li
                key={c.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5"
              >
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full"
                  style={{ background: c.fill }}
                />
                {c.short}: {c.activeCorrespondents} ACs · top-3 {fmtPct(c.top3SharePct)}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {view === "buckets" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="AC bucket mix"
            subtitle={
              bucketLens === "corridorSharePct"
                ? "Share of corridors by active-correspondent count"
                : "Share of message volume by AC bucket"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bucketPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {bucketPie.map((b) => (
                      <Cell key={b.name} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Bucket ladder"
            subtitle="Corridor share vs volume share by AC depth"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AC_BUCKETS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="corridorSharePct"
                    name="Corridor share"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="volumeSharePct"
                    name="Volume share"
                    fill={EMERALD}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "curve" && (
        <ChartCard
          title="Concentration curve"
          subtitle="Cumulative share of active correspondents vs messages by corridor rank"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CONCENTRATION_CURVE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="corridorPct"
                  tick={{ fontSize: 12 }}
                  unit="%"
                  label={{
                    value: "Corridors (ranked)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="messageSharePct"
                  name="Message share"
                  fill={VIOLET}
                  fillOpacity={0.2}
                  stroke={VIOLET}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="acSharePct"
                  name="AC share"
                  stroke={SKY}
                  strokeWidth={2}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="corridorPct"
                  name="Equality"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            FSB reported a Gini of ~{HEADLINE.corridorAcGini2018} on ACs per
            corridor in 2018; desk proxy for 2025 ≈ {HEADLINE.corridorAcGini2025Est}.
          </p>
        </ChartCard>
      )}

      {view === "currency" && (
        <ChartCard
          title="Currency lens"
          subtitle="2018 active-correspondent decline by currency (FSB) with message-share context"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currencyBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Bar
                  dataKey="decline2018Pct"
                  name="2018 AC decline %"
                  radius={[4, 4, 0, 0]}
                >
                  {currencyBars.map((c) => (
                    <Cell key={c.id} fill={c.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            USD relationships shrank fastest in the 2018 FSB print (
            {fmtPct(HEADLINE.usdAcDecline2018Pct, 1)}) versus EUR (
            {fmtPct(HEADLINE.eurAcDecline2018Pct, 1)}) and GBP (
            {fmtPct(HEADLINE.gbpAcDecline2018Pct, 1)}).
          </p>
        </ChartCard>
      )}

      <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Sources & caveats
        </summary>
        <p className="mt-2 leading-relaxed">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
