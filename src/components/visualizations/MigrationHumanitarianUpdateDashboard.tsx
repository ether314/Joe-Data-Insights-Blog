"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  COMPOSITION_DELTA,
  GHO_LEDGER,
  HEADLINE,
  HOST_DELTAS,
  HOSTING_INCOME_DELTA,
  RETURN_FLOWS,
  SOLUTIONS_CHANNELS,
  SOURCE_NOTE,
  SOURCES,
  STOCK_VS_FUNDED,
  VINTAGE_METERS,
  fmtBn,
  fmtDelta,
  fmtM,
  fmtPct,
  type HostDeltaRow,
  type RegionLane,
  type VintageMeter,
} from "@/data/migration-humanitarian-update-2026-data";

// viz-types: dumbbell vintage meters, dual-axis stock×funded, diverging host Δ bars, return flow bars, income-mix scatter | layout: default
// viz-plan: prior→new dumbbells; displacement vs UNHCR funded %; host stock deltas; return corridors; income-share scatter; region + scope + sort controls

type RegionFilter = "All" | RegionLane;
type ScopeFilter = "people" | "funding" | "hosts";
type SortMode = "delta" | "newest" | "name";

const COLORS = {
  prior: "#94a3b8",
  newest: "#0f766e",
  down: "#0369a1",
  up: "#be123c",
  amber: "#d97706",
  violet: "#7c3aed",
  slate: "#334155",
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
                ? "bg-teal-800 text-white"
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

function meterDisplay(m: VintageMeter, value: number): string {
  if (m.unit === "millions") return fmtM(value, 1);
  if (m.unit === "bn") return fmtBn(value, 1);
  if (m.unit === "count") return value.toLocaleString();
  return fmtPct(value, value % 1 === 0 ? 0 : 1);
}

function MeterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: VintageMeter & { barPrior: number; barNew: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{row.label}</p>
      <p className="text-sm text-slate-700">
        Prior: <strong>{meterDisplay(row, row.prior)}</strong> → Newest:{" "}
        <strong>{meterDisplay(row, row.newest)}</strong>
      </p>
      <p className="text-sm text-slate-700">
        Δ {fmtDelta(row.delta, row.deltaUnit)}
      </p>
      <p className="mt-1 text-xs text-slate-500">{row.note}</p>
    </div>
  );
}

function HostTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: HostDeltaRow }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{row.country}</p>
      <p className="text-sm text-slate-700">
        Hosted: {fmtM(row.priorHostedM)} → <strong>{fmtM(row.newHostedM)}</strong>
      </p>
      <p className="text-sm text-slate-700">
        Δ {fmtM(row.deltaM)} ({fmtDelta(row.deltaPct, "pct", 0)})
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {row.income}-income · {row.note}
      </p>
    </div>
  );
}

export function MigrationHumanitarianUpdateDashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [scope, setScope] = useState<ScopeFilter>("people");
  const [sortMode, setSortMode] = useState<SortMode>("delta");

  const meters = useMemo(() => {
    const peopleIds = new Set([
      "displaced",
      "idp",
      "refugees",
      "asylum",
      "lmic",
      "ldc",
    ]);
    const fundingIds = new Set(["unhcr", "gho", "ghoReq"]);
    const filtered = VINTAGE_METERS.filter((m) => {
      if (scope === "people") return peopleIds.has(m.id);
      if (scope === "funding") return fundingIds.has(m.id);
      return m.id === "lmic" || m.id === "ldc";
    });
    return [...filtered]
      .sort((a, b) => {
        if (sortMode === "name") return a.label.localeCompare(b.label);
        if (sortMode === "newest") return b.newest - a.newest;
        return Math.abs(b.delta) - Math.abs(a.delta);
      })
      .map((m) => ({
        ...m,
        barPrior: m.prior,
        barNew: m.newest,
        fill:
          m.betterWhen === "up"
            ? m.delta >= 0
              ? COLORS.newest
              : COLORS.up
            : m.betterWhen === "down"
              ? m.delta <= 0
                ? COLORS.down
                : COLORS.up
              : COLORS.amber,
      }));
  }, [scope, sortMode]);

  const hosts = useMemo(() => {
    const rows = HOST_DELTAS.filter(
      (h) => region === "All" || h.region === region,
    );
    return [...rows].sort((a, b) => a.deltaM - b.deltaM);
  }, [region]);

  const returns = useMemo(() => {
    const rows = RETURN_FLOWS.filter(
      (r) => region === "All" || r.region === region,
    );
    return [...rows].sort((a, b) => b.totalM - a.totalM);
  }, [region]);

  const incomeScatter = HOSTING_INCOME_DELTA.map((r) => ({
    ...r,
    x: r.priorPct,
    y: r.newPct,
    z: Math.abs(r.deltaPp) * 40 + 80,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="migration-humanitarian-update-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Vintage update · Global Trends 2025
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          First decade decline — hosts still carry the ledger
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Forced displacement fell to{" "}
          <strong className="text-white">{fmtM(HEADLINE.displacedNewM)}</strong> at
          end-2025 (
          <strong className="text-teal-300">
            {fmtDelta(HEADLINE.displacedDeltaM, "abs")} /{" "}
            {fmtDelta(HEADLINE.displacedDeltaPct, "pct")}
          </strong>{" "}
          vs the research print&apos;s {fmtM(HEADLINE.displacedPriorM)}). Returns
          surged; resettlement halved; UNHCR coverage stayed at{" "}
          <strong className="text-amber-300">
            {fmtPct(HEADLINE.unhcrFunded2025Pct)}
          </strong>
          ; GHO coverage barely moved while the ask shrank{" "}
          <strong className="text-amber-300">
            {fmtDelta(HEADLINE.ghoReqDeltaPct, "pct", 0)}
          </strong>
          .
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Displaced Δ",
              value: fmtDelta(HEADLINE.displacedDeltaM, "abs"),
            },
            {
              label: "LMIC host share",
              value: `${fmtPct(HEADLINE.lmicHostNewPct)} (${fmtDelta(HEADLINE.lmicHostDeltaPp, "pp", 0)})`,
            },
            {
              label: "UNHCR funded 2025",
              value: fmtPct(HEADLINE.unhcrFunded2025Pct),
            },
            {
              label: "GHO coverage Δ",
              value: fmtDelta(HEADLINE.ghoCoverageNewPct - HEADLINE.ghoCoveragePriorPct, "pp", 1),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Meter scope"
          value={scope}
          onChange={setScope}
          options={[
            { id: "people", label: "People" },
            { id: "funding", label: "Funding" },
            { id: "hosts", label: "Host shares" },
          ]}
        />
        <ToggleGroup
          label="Sort meters"
          value={sortMode}
          onChange={setSortMode}
          options={[
            { id: "delta", label: "Largest Δ" },
            { id: "newest", label: "Newest level" },
            { id: "name", label: "A–Z" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "All", label: "All" },
            { id: "Africa", label: "Africa" },
            { id: "MENA", label: "MENA" },
            { id: "Europe", label: "Europe" },
            { id: "Asia-Pacific", label: "Asia-Pac" },
            { id: "Americas", label: "Americas" },
          ]}
        />
      </div>

      <ChartCard
        title="Prior research print → Global Trends 2025"
        subtitle="Dumbbell meters: end-2024 / GHO 2025 Oct vs end-2025 / GHO 2026 May"
      >
        <div className="h-[360px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={meters}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<MeterTooltip />} />
              <Bar dataKey="barPrior" barSize={10} fill={COLORS.prior} name="Prior" />
              <Bar dataKey="barNew" barSize={10} fill={COLORS.newest} name="Newest" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Grey = prior research vintage · Teal = newest official print
        </p>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Displacement stock vs UNHCR funded %"
          subtitle="Stock fell in 2025; funding coverage kept falling"
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={STOCK_VS_FUNDED}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[30, 70]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <ReferenceLine
                  yAxisId="left"
                  y={HEADLINE.displacedPriorM}
                  stroke={COLORS.prior}
                  strokeDasharray="4 4"
                />
                <Bar
                  yAxisId="left"
                  dataKey="displacedM"
                  fill="#0ea5e9"
                  name="Displaced (M)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fundedPct"
                  stroke={COLORS.amber}
                  strokeWidth={2.5}
                  name="UNHCR funded %"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Composition Δ (millions)"
          subtitle="IDPs drove most of the stock drop; asylum backlog grew"
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COMPOSITION_DELTA}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="priorM" fill={COLORS.prior} name="Prior (end-2024)" />
                <Bar dataKey="newM" fill={COLORS.newest} name="Newest (end-2025)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Host stock deltas by country"
        subtitle="Iran and Türkiye shrank via returns; Chad and Uganda absorbed more"
      >
        <div className="h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={hosts}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}M`}
              />
              <YAxis
                type="category"
                dataKey="short"
                width={80}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<HostTooltip />} />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <Bar dataKey="deltaM" name="Hosted Δ (M)" radius={[0, 4, 4, 0]}>
                {hosts.map((h) => (
                  <Cell
                    key={h.country}
                    fill={h.deltaM >= 0 ? COLORS.up : COLORS.down}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Return corridors that cut the stock"
          subtitle="Six countries = 92% of 14.7M refugee+IDP returns in 2025"
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={returns}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={90}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="totalM" fill={COLORS.violet} name="Returns (M)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Income-group host mix: prior → new"
          subtitle="Scatter on 45° line; points below = share fell"
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Prior %"
                  domain={[10, 45]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Prior %",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="New %"
                  domain={[10, 45]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "New %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    `${Number(value ?? 0)}%`,
                    name === "x" ? "Prior" : name === "y" ? "New" : String(name),
                  ]}
                  labelFormatter={(_, p) =>
                    (p?.[0]?.payload as { group?: string })?.group ?? ""
                  }
                />
                <ReferenceLine
                  segment={[
                    { x: 10, y: 10 },
                    { x: 45, y: 45 },
                  ]}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                />
                <Scatter data={incomeScatter} fill={COLORS.newest}>
                  {incomeScatter.map((d) => (
                    <Cell
                      key={d.group}
                      fill={d.deltaPp < 0 ? COLORS.down : COLORS.up}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {HOSTING_INCOME_DELTA.map((d) => (
              <span key={d.group}>
                <strong>{d.group}</strong>: {d.priorPct}% → {d.newPct}% (
                {fmtDelta(d.deltaPp, "pp", 0)})
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Solutions channels vs resettlement collapse"
        subtitle="Returns at record scale; resettlement arrivals ≈ 3% of stated need"
      >
        <div className="h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={SOLUTIONS_CHANNELS}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="short" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => (v >= 1 ? `${v}M` : `${(v * 1000).toFixed(0)}k`)}
              />
                <Tooltip
                formatter={(v) => {
                  const n = Number(v ?? 0);
                  return n >= 1 ? fmtM(n) : `${Math.round(n * 1000)}k`;
                }}
              />
              <Bar dataKey="valueM" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                {SOLUTIONS_CHANNELS.map((c) => (
                  <Cell
                    key={c.channel}
                    fill={
                      c.short === "Resettle" || c.short === "Need"
                        ? COLORS.amber
                        : COLORS.violet
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="GHO ledger: coverage flat, ask cut"
        subtitle="GHO 2025 Oct vs GHO 2026 Mid-Year (31 May 2026 FTS)"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Meter</th>
                <th className="py-2 pr-4">Prior print</th>
                <th className="py-2 pr-4">Newest</th>
                <th className="py-2">Reading</th>
              </tr>
            </thead>
            <tbody>
              {GHO_LEDGER.map((row) => (
                <tr key={row.label} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 font-medium text-slate-900">
                    {row.label}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600">
                    {row.unit === "pct"
                      ? fmtPct(row.priorBn, 1)
                      : fmtBn(row.priorBn)}
                  </td>
                  <td className="py-2.5 pr-4 font-semibold text-teal-800">
                    {row.unit === "pct"
                      ? fmtPct(row.newBn, 1)
                      : fmtBn(row.newBn)}
                  </td>
                  <td className="py-2.5 text-slate-500">
                    {row.label === "Coverage %"
                      ? "+1.0pp — ask shrank more than funding rose"
                      : row.label === "Requirements"
                        ? "−26% prioritized 2026 ask"
                        : "−$2.4B vs prior funded print"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-teal-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
