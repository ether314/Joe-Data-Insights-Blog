"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CONDITION_MIX,
  DETAIL_TABLE,
  HEADLINE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  conditionTreemap,
  crossingSplitSeries,
  fmtAdt,
  fmtPct,
  funcExposureRows,
  scatterPoints,
  trendSeries,
  type MetricMode,
} from "@/data/structurally-deficient-bridges-versus-daily-traffic-2026-data";

// viz-types: dual-line poor-share trend, condition stacked bars,
// functional-class grouped exposure bars, state scatter, crossing area stack
// | layout: default
// smoke-marker: Poor-share trend vs deck area

type ViewId = "trend" | "mix" | "exposure" | "scatter" | "crossings";
type RealmFilter = "all" | "rural" | "urban";

const TEAL = "#0d9488";
const AMBER = "#d97706";
const INDIGO = "#4f46e5";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const EMERALD = "#059669";

const CONDITION_COLORS: Record<string, string> = {
  good: EMERALD,
  fair: INDIGO,
  poor: ROSE,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "trend", label: "Poor-share trend vs deck area" },
  { id: "mix", label: "Condition mix treemap" },
  { id: "exposure", label: "Functional class ADT exposure" },
  { id: "scatter", label: "State poor share scatter" },
  { id: "crossings", label: "Daily crossing split" },
];

const REALMS: { id: RealmFilter; label: string }[] = [
  { id: "all", label: "All realms" },
  { id: "rural", label: "Rural" },
  { id: "urban", label: "Urban" },
];

const METRICS: { id: MetricMode; label: string }[] = [
  { id: "count", label: "Bridge count" },
  { id: "deck", label: "Deck area" },
  { id: "adt", label: "ADT proxy" },
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className="mt-3 h-72 w-full">{children}</div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function StructurallyDeficientBridgesVersusDailyTraffic2026Dashboard() {
  const [view, setView] = useState<ViewId>("trend");
  const [realm, setRealm] = useState<RealmFilter>("all");
  const [metric, setMetric] = useState<MetricMode>("count");

  const trendData = useMemo(() => trendSeries(), []);
  const mixData = useMemo(() => conditionTreemap(metric), [metric]);
  const exposureData = useMemo(() => funcExposureRows(realm), [realm]);
  const scatterData = useMemo(() => scatterPoints(), []);
  const crossingData = useMemo(() => crossingSplitSeries(), []);

  return (
    <div
      data-viz="structurally-deficient-bridges-versus-daily-traffic-2026"
      className="my-8 space-y-4"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Poor spans (NBI 2024)</p>
            <p className="text-lg font-semibold text-slate-900">
              {HEADLINE.poorSharePct}% · {HEADLINE.poorBridges.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Daily crossings on poor spans</p>
            <p className="text-lg font-semibold text-slate-900">
              {HEADLINE.dailyCrossingsPoorM}M ({HEADLINE.poorCrossingSharePct}%)
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Mean ADT — poor vs all</p>
            <p className="text-lg font-semibold text-slate-900">
              {fmtAdt(HEADLINE.avgAdtPoor)} vs {fmtAdt(HEADLINE.avgAdtAll)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Poor deck-area share</p>
            <p className="text-lg font-semibold text-slate-900">
              {HEADLINE.poorDeckAreaSharePct}% vs {HEADLINE.poorSharePct}% count
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <ControlRow label="View">
          {VIEWS.map((v) => (
            <ToggleBtn key={v.id} active={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        {view === "exposure" ? (
          <ControlRow label="Realm">
            {REALMS.map((r) => (
              <ToggleBtn key={r.id} active={realm === r.id} onClick={() => setRealm(r.id)}>
                {r.label}
              </ToggleBtn>
            ))}
          </ControlRow>
        ) : null}
        {view === "mix" ? (
          <ControlRow label="Metric">
            {METRICS.map((m) => (
              <ToggleBtn key={m.id} active={metric === m.id} onClick={() => setMetric(m.id)}>
                {m.label}
              </ToggleBtn>
            ))}
          </ControlRow>
        ) : null}
        <p className="text-[10px] text-slate-400">{VIZ_MARKERS.join(" · ")}</p>
      </div>

      {view === "trend" ? (
        <ChartCard
          title="Poor-share trend vs deck area"
          subtitle="Bridge count share (rose) vs deck-area share (teal) — NBI 2014–2024"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="poorShare" name="Poor count share" stroke={ROSE} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="deckShare" name="Poor deck share" stroke={TEAL} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "mix" ? (
        <ChartCard
          title="Condition mix treemap"
          subtitle={`Good / Fair / Poor split by ${metric === "count" ? "bridge count" : metric === "deck" ? "deck area" : "ADT weight"}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mixData} layout="vertical" margin={{ top: 8, right: 16, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtPct(Number(v), 0)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={72} />
              <RechartsTooltip formatter={(v) => [fmtPct(Number(v), 1), "Share"]} />
              <Bar dataKey="sharePct" name="Share of total" radius={[0, 4, 4, 0]}>
                {mixData.map((entry) => (
                  <Cell key={entry.id} fill={CONDITION_COLORS[entry.id] ?? SLATE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "exposure" ? (
        <ChartCard
          title="Functional class ADT exposure"
          subtitle="Poor-span count share vs ADT share — where traffic meets deficiency"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exposureData} margin={{ top: 8, right: 16, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={56} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="countShare" name="Poor count share" fill={AMBER} radius={[2, 2, 0, 0]} />
              <Bar dataKey="adtShare" name="Poor ADT share" fill={INDIGO} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="State poor share scatter"
          subtitle="Poor-span share vs mean ADT on those spans — bubble size = daily crossings (000s)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="poorShare" name="Poor share" unit="%" tick={{ fontSize: 11 }} domain={[0, 24]} />
              <YAxis type="number" dataKey="avgAdt" name="Mean ADT" tick={{ fontSize: 11 }} />
              <ZAxis type="number" dataKey="crossingsK" range={[40, 400]} />
              <RechartsTooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => {
                  const n = Number(v);
                  if (name === "Mean ADT") return [fmtAdt(n), name];
                  if (name === "Poor share") return [`${n.toFixed(1)}%`, name];
                  return [v, name];
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.state ?? ""}
              />
              <Scatter data={scatterData} fill={TEAL} name="States" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "crossings" ? (
        <ChartCard
          title="Daily crossing split"
          subtitle="Millions of daily vehicle crossings on poor vs non-poor spans"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={crossingData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
              <RechartsTooltip formatter={(v) => [`${Number(v).toFixed(1)}M`, "Crossings"]} />
              <Legend />
              <Area type="monotone" dataKey="nonPoorM" name="Non-poor crossings" stackId="1" stroke={EMERALD} fill={EMERALD} fillOpacity={0.5} />
              <Area type="monotone" dataKey="poorM" name="Poor crossings" stackId="1" stroke={ROSE} fill={ROSE} fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Metric</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">All bridges</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Poor spans</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {DETAIL_TABLE.map((row) => (
              <tr key={row.metric}>
                <td className="px-4 py-2 font-medium text-slate-900">{row.metric}</td>
                <td className="px-4 py-2 text-slate-700">{row.allBridges}</td>
                <td className="px-4 py-2 text-slate-700">{row.poorBridges}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
