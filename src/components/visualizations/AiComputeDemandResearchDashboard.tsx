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
  HUBS,
  HYPERSCALER_SHARE_PATH,
  LAB_USE,
  OWNERS,
  POWER_PATH,
  SOURCE_NOTE,
  SOURCES,
  WORKLOAD_SPLIT,
  fmtGw,
  fmtH100e,
  fmtPct,
  rankedHubs,
  rankedOwners,
  rankedRegions,
} from "@/data/ai-compute-demand-research-2026-data";

// viz-types: ownership horizontal bars, hyperscaler-share area, geography bars, power composed (GW+AI%), workload stacked bars, own-vs-use scatter | layout: default

type Panel =
  | "ownership"
  | "concentration"
  | "geography"
  | "power"
  | "workload"
  | "labs";

type OwnerMetric = "share" | "h100e";
type HubRegion = "all" | "United States" | "China" | "Europe" | "Middle East" | "Rest of Asia-Pacific";

const PANEL_OPTS: { id: Panel; label: string }[] = [
  { id: "ownership", label: "Who owns compute" },
  { id: "concentration", label: "Hyperscaler share" },
  { id: "geography", label: "Where it sits" },
  { id: "power", label: "Power capacity" },
  { id: "workload", label: "Train vs infer" },
  { id: "labs", label: "Own vs use" },
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

export function AiComputeDemandResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("ownership");
  const [ownerMetric, setOwnerMetric] = useState<OwnerMetric>("share");
  const [hubRegion, setHubRegion] = useState<HubRegion>("all");

  const owners = useMemo(() => rankedOwners(), []);
  const regions = useMemo(() => rankedRegions(), []);
  const hubs = useMemo(() => rankedHubs(hubRegion), [hubRegion]);

  const ownerChart = useMemo(
    () =>
      owners.map((o) => ({
        name: o.label,
        value: ownerMetric === "share" ? o.sharePct : o.h100eMillions,
        fill: o.color,
        confidence: o.confidence,
      })),
    [owners, ownerMetric],
  );

  const sharePath = useMemo(
    () =>
      HYPERSCALER_SHARE_PATH.map((p) => ({
        label: p.label,
        share: p.sharePct,
        disclosed: p.confidence === "disclosed" ? p.sharePct : null,
      })),
    [],
  );

  const powerChart = useMemo(
    () =>
      POWER_PATH.map((p) => ({
        year: String(p.year),
        gw: p.capacityGw,
        aiShare: p.aiSharePct,
      })),
    [],
  );

  const workloadChart = useMemo(
    () =>
      WORKLOAD_SPLIT.map((w) => ({
        year: String(w.year),
        Training: w.trainingPct,
        Inference: w.inferencePct,
      })),
    [],
  );

  const labScatter = useMemo(
    () =>
      LAB_USE.map((l) => ({
        name: l.label,
        access: l.h100eMillions,
        ownershipProxy: l.ownsMostly ? l.h100eMillions : l.h100eMillions * 0.15,
        z: l.h100eMillions * 80,
        fill: l.color,
        owns: l.ownsMostly ? "Mostly owns" : "Mostly rents",
      })),
    [],
  );

  const maxOwner = ownerChart[0]?.value ?? 25;
  const maxHub = hubs[0]?.approxMw ?? 5000;

  return (
    <div
      className="space-y-6"
      data-viz="ai-compute-demand-research-2026"
    >
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Who owns AI compute
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {fmtPct(HEADLINE.hyperscalerShareQ4_2025Pct)} Big-5 share
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Amazon, Google, Meta, Microsoft, and Oracle hold an estimated{" "}
            <strong>{fmtPct(HEADLINE.hyperscalerShareQ4_2025Pct)}</strong> of
            world AI compute (H100e) as of Q4 2025 — up from{" "}
            {fmtPct(HEADLINE.hyperscalerShareQ1_2024Pct)} in Q1 2024 (Epoch AI).
            Google alone is ~{fmtPct(HEADLINE.googleSharePct)}.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            US AI DC capacity
          </p>
          <p className="mt-1 text-2xl font-bold text-sky-700">
            {fmtPct(HEADLINE.usAiDcCapacitySharePct)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            of global AI data-center capacity by power draw
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Global DC capacity 2026
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-700">
            {fmtGw(HEADLINE.dcCapacityGw2026)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            +{HEADLINE.capacityGrowth2026Pct}% vs {fmtGw(HEADLINE.dcCapacityGw2025)}{" "}
            in 2025 (Gartner)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PANEL_OPTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {panel === "ownership" && (
        <ChartCard
          title="Compute ownership leaderboard (Q4 2025)"
          subtitle="H100-equivalent share of global AI compute · Epoch anchors + residual estimates"
        >
          <div className="mb-4">
            <ToggleGroup
              label="Metric"
              value={ownerMetric}
              options={[
                { id: "share", label: "% of world" },
                { id: "h100e", label: "H100e millions" },
              ]}
              onChange={setOwnerMetric}
            />
          </div>
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ownerChart}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  domain={[0, Math.ceil(maxOwner * 1.1)]}
                  tickFormatter={(v) =>
                    ownerMetric === "share" ? `${v}%` : `${v}`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) =>
                    ownerMetric === "share"
                      ? fmtPct(Number(v), 0)
                      : fmtH100e(Number(v))
                  }
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Ownership">
                  {ownerChart.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Big-5 hyperscalers sum to {fmtPct(HEADLINE.hyperscalerShareQ4_2025Pct)}.
            China aggregate owners ≈ {fmtPct(HEADLINE.chinaOwnerSharePct)} — less
            than Google alone.
          </p>
        </ChartCard>
      )}

      {panel === "concentration" && (
        <ChartCard
          title="Hyperscaler concentration path"
          subtitle="Amazon + Google + Meta + Microsoft + Oracle share of world AI compute"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sharePath} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[58, 76]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(v) => (v != null ? fmtPct(Number(v), 1) : "—")} />
                <Area
                  type="monotone"
                  dataKey="share"
                  stroke="#0ea5e9"
                  fill="#bae6fd"
                  strokeWidth={2}
                  name="Big-5 share"
                />
                <Line
                  type="monotone"
                  dataKey="disclosed"
                  stroke="#0369a1"
                  strokeWidth={0}
                  dot={{ r: 5, fill: "#0369a1" }}
                  connectNulls={false}
                  name="Epoch disclosed"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Dark dots mark Epoch-disclosed endpoints (Q1 2024 ={" "}
            {fmtPct(HEADLINE.hyperscalerShareQ1_2024Pct)}; Q4 2025 ={" "}
            {fmtPct(HEADLINE.hyperscalerShareQ4_2025Pct)}). Interim quarters are
            interpolated.
          </p>
        </ChartCard>
      )}

      {panel === "geography" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="AI DC capacity by region"
            subtitle="Share of global AI data-center capacity by power draw (mid-2026 synthesis)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regions.map((r) => ({
                    name: r.label,
                    share: r.sharePct,
                    fill: r.color,
                  }))}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="share" radius={[0, 4, 4, 0]} name="Capacity share">
                    {regions.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Selected campus / metro hubs"
            subtitle="Approximate AI-relevant IT MW — order of magnitude, not a census"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Region filter"
                value={hubRegion}
                options={[
                  { id: "all", label: "All" },
                  { id: "United States", label: "US" },
                  { id: "China", label: "China" },
                  { id: "Europe", label: "Europe" },
                  { id: "Middle East", label: "ME" },
                  { id: "Rest of Asia-Pacific", label: "APAC" },
                ]}
                onChange={setHubRegion}
              />
            </div>
            <div className="space-y-2">
              {hubs.map((h) => {
                const w = Math.max(4, (h.approxMw / maxHub) * 100);
                return (
                  <div
                    key={h.hub}
                    className="grid grid-cols-[minmax(0,11rem)_1fr_4rem] items-center gap-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-800">
                        {h.hub}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {h.status} · {h.operators}
                      </div>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold tabular-nums text-slate-900">
                      {(h.approxMw / 1000).toFixed(1)} GW
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Hub MW mixes live, under-construction, and announced IT loads — see
              caveats. For site-level rows, see the global AI data-center build
              tracker.
            </p>
          </ChartCard>
        </div>
      )}

      {panel === "power" && (
        <ChartCard
          title="Global data-center power capacity vs AI server share"
          subtitle="Gartner capacity (GW) with AI-optimised server share of DC power (%)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={powerChart} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{ value: "GW", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                  domain={[0, 60]}
                />
                <Tooltip />
                <Bar yAxisId="left" dataKey="gw" fill="#0ea5e9" name="DC capacity (GW)" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="aiShare"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  connectNulls
                  name="AI server share of DC power"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2026: {fmtGw(HEADLINE.dcCapacityGw2026)} capacity ·{" "}
            {HEADLINE.dcTwh2026} TWh electricity · AI-optimised servers{" "}
            {fmtPct(HEADLINE.aiServerShareOfDcPower2026Pct)} of DC power. Path to{" "}
            {fmtGw(HEADLINE.dcCapacityGw2030)} by 2030.
          </p>
        </ChartCard>
      )}

      {panel === "workload" && (
        <ChartCard
          title="Training vs inference share of AI compute volume"
          subtitle="Not ownership — how installed compute is used over time"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadChart} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
                <Bar dataKey="Training" stackId="a" fill="#6366f1" name="Training" />
                <Bar dataKey="Inference" stackId="a" fill="#14b8a6" name="Inference" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Inference flips to majority by 2026 in this synthesis — continuous,
            geographically sticky demand vs episodic training clusters. Industry
            estimates; not a single disclosed series.
          </p>
        </ChartCard>
      )}

      {panel === "labs" && (
        <ChartCard
          title="Frontier access vs ownership posture"
          subtitle="X = approximate access (H100e millions) · Y = ownership proxy · bubble = scale"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="access"
                  name="Access"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Access (M H100e)", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="ownershipProxy"
                  name="Owned"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Owned proxy", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) =>
                    name === "Access" || name === "Owned"
                      ? fmtH100e(Number(v))
                      : String(v)
                  }
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.name ?? ""
                  }
                />
                <Scatter data={labScatter} name="Labs">
                  {labScatter.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {LAB_USE.map((l) => (
              <li key={l.id}>
                <span className="font-semibold text-slate-800">{l.label}:</span>{" "}
                {l.note}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2">
          Owner rows: {OWNERS.length} · Hubs tracked: {HUBS.length} · World stock
          implied ≈ {fmtH100e(HEADLINE.worldH100eMillions)}.
        </p>
      </div>
    </div>
  );
}
