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
  COMPOSITION_2024,
  DAC_TOTAL_PATH,
  DONORS_2024,
  HEADLINE,
  MEMO_BLOCKS,
  PRESSURE_LINES,
  SOURCE_NOTE,
  SOURCES,
  fmtBn,
  fmtPct,
  fmtSignedPct,
  rankedByIntensity,
  rankedByVolume,
  type DonorGroup,
  type DonorRow,
} from "@/data/oecd-dac-oda-data";

// viz-types: scatter volume×intensity, lollipop GNI%, ranked volume bars, composition pie, trend area | layout: default

type SortMode = "volume" | "intensity";
type GroupFilter = "All" | DonorGroup;
type HighlightMode = "all" | "hit07" | "missed";

const COLORS: Record<DonorGroup, string> = {
  G7: "#0ea5e9",
  Nordic: "#14b8a6",
  "Other Europe": "#8b5cf6",
  "Asia-Pacific": "#f59e0b",
  Other: "#64748b",
};

const PIE_COLORS = ["#0f766e", "#0ea5e9", "#f59e0b", "#f43f5e", "#a78bfa"];

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

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: DonorRow }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-900">{row.country}</p>
      <p className="text-slate-700">
        Volume: <strong>{fmtBn(row.odaBn)}</strong>
      </p>
      <p className="text-slate-700">
        ODA/GNI: <strong>{fmtPct(row.odaGniPct)}</strong>
        {row.hit07 ? " · hit 0.7%" : ""}
      </p>
      {row.realChangePct != null && (
        <p className="text-slate-600">
          Real Δ 2023→24: {fmtSignedPct(row.realChangePct)}
        </p>
      )}
    </div>
  );
}

export function OecdDacOdaDashboard() {
  const [sortMode, setSortMode] = useState<SortMode>("volume");
  const [group, setGroup] = useState<GroupFilter>("All");
  const [highlight, setHighlight] = useState<HighlightMode>("all");

  const filtered = useMemo(() => {
    return DONORS_2024.filter((d) => {
      if (group !== "All" && d.group !== group) return false;
      if (highlight === "hit07" && !d.hit07) return false;
      if (highlight === "missed" && d.hit07) return false;
      return true;
    });
  }, [group, highlight]);

  const ranked = useMemo(() => {
    const rows =
      sortMode === "volume"
        ? [...filtered].sort((a, b) => b.odaBn - a.odaBn)
        : [...filtered].sort((a, b) => b.odaGniPct - a.odaGniPct);
    return rows;
  }, [filtered, sortMode]);

  const intensityLollipops = useMemo(() => rankedByIntensity().slice(0, 12), []);
  const volumeBars = useMemo(() => rankedByVolume().slice(0, 12), []);
  const scatterData = useMemo(
    () =>
      filtered.map((d) => ({
        ...d,
        x: d.odaBn,
        y: d.odaGniPct,
        z: Math.max(40, d.odaBn * 2),
      })),
    [filtered],
  );

  return (
    <div data-viz className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-xl border border-rose-900/20 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300/90">
          OECD DAC ODA 2024 — preliminary grant-equivalent
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtBn(HEADLINE.totalOdaBn, 1)} — first real drop in six years (
          {fmtSignedPct(HEADLINE.realChangePct)})
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          DAC members provided{" "}
          <strong className="text-white">{fmtBn(HEADLINE.totalOdaBn, 1)}</strong>{" "}
          in 2024 —{" "}
          <strong className="text-white">{fmtPct(HEADLINE.dacGniPct)}</strong> of
          combined GNI. The US alone is{" "}
          <strong className="text-white">{fmtPct(HEADLINE.usSharePct, 0)}</strong>{" "}
          of the pile at {fmtBn(HEADLINE.usBn, 1)}, yet only{" "}
          <strong className="text-white">{HEADLINE.hit07Count}</strong> countries
          cleared the UN 0.7% of GNI target.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="Sort ranked panels"
          value={sortMode}
          onChange={setSortMode}
          options={[
            { id: "volume", label: "By $ volume" },
            { id: "intensity", label: "By ODA/GNI" },
          ]}
        />
        <ToggleGroup
          label="Group"
          value={group}
          onChange={setGroup}
          options={[
            { id: "All", label: "All" },
            { id: "G7", label: "G7" },
            { id: "Nordic", label: "Nordic" },
            { id: "Other Europe", label: "Other Europe" },
            { id: "Asia-Pacific", label: "Asia-Pacific" },
          ]}
        />
        <ToggleGroup
          label="0.7% target"
          value={highlight}
          onChange={setHighlight}
          options={[
            { id: "all", label: "All donors" },
            { id: "hit07", label: "Hit 0.7%" },
            { id: "missed", label: "Missed" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Volume vs intensity frontier"
          subtitle="X = ODA $bn · Y = ODA/GNI %. Dashed line = UN 0.7% target. Bubble size scales with volume."
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <ScatterChart margin={{ top: 12, right: 16, bottom: 20, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="ODA $bn"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  label={{
                    value: "ODA volume ($bn)",
                    position: "insideBottom",
                    offset: -8,
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="ODA/GNI"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 1.15]}
                />
                <ZAxis type="number" dataKey="z" range={[40, 400]} />
                <ReferenceLine
                  y={HEADLINE.unTargetPct}
                  stroke="#f43f5e"
                  strokeDasharray="6 4"
                  label={{
                    value: "0.7% UN target",
                    position: "insideTopRight",
                    fill: "#be123c",
                    fontSize: 11,
                  }}
                />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.country} fill={COLORS[d.group]} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Who hits 0.7% of GNI?"
          subtitle="Top 12 by ODA/GNI — lollipop (highest → lowest). Only four clear the dashed target."
        >
          <div className="h-80 min-h-[280px] w-full space-y-2.5 overflow-y-auto px-1 py-2">
            {intensityLollipops.map((d) => (
              <div key={d.country} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 truncate font-medium text-slate-800">
                  {d.short}
                </span>
                <div className="relative h-3 flex-1 rounded-full bg-slate-100">
                  <div
                    className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2"
                    style={{
                      width: `${(d.odaGniPct / 1.1) * 100}%`,
                      background: d.hit07 ? "#0f766e" : "#94a3b8",
                    }}
                  />
                  <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                    style={{
                      left: `calc(${(d.odaGniPct / 1.1) * 100}% - 7px)`,
                      background: d.hit07 ? "#0d9488" : "#64748b",
                    }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-rose-400"
                    style={{ left: `${(0.7 / 1.1) * 100}%` }}
                    title="0.7% target"
                  />
                </div>
                <span className="w-14 shrink-0 text-right font-semibold tabular-nums text-slate-800">
                  {fmtPct(d.odaGniPct)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={
            sortMode === "volume"
              ? "Ranked ODA volumes (filtered)"
              : "Ranked ODA/GNI (filtered)"
          }
          subtitle="Highest → lowest. Use Group / 0.7% toggles above. Bars use the active sort."
        >
          <div className="h-96 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <BarChart
                data={ranked}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    sortMode === "volume" ? `$${v}B` : `${v}%`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, _name, item) => {
                    const row = item?.payload as DonorRow | undefined;
                    if (sortMode === "volume") {
                      return [
                        `${fmtBn(Number(value))} (${fmtPct(row?.odaGniPct ?? 0)} of GNI)`,
                        row?.country ?? "ODA",
                      ];
                    }
                    return [
                      `${fmtPct(Number(value))} · ${fmtBn(row?.odaBn ?? 0)}`,
                      row?.country ?? "ODA/GNI",
                    ];
                  }}
                />
                <Bar
                  dataKey={sortMode === "volume" ? "odaBn" : "odaGniPct"}
                  name={sortMode === "volume" ? "ODA $bn" : "ODA/GNI %"}
                  radius={[0, 6, 6, 0]}
                >
                  {ranked.map((d) => (
                    <Cell key={d.country} fill={COLORS[d.group]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="What is inside the $212B?"
          subtitle="DAC Table 1 composition — ranked highest → lowest."
        >
          <div className="grid h-96 min-h-[280px] grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [
                      fmtBn(Number(value)),
                      String(name),
                    ]}
                  />
                  <Pie
                    data={COMPOSITION_2024}
                    dataKey="bn"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {COMPOSITION_2024.map((row, i) => (
                      <Cell
                        key={row.slice}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-col justify-center space-y-2 text-sm">
              {COMPOSITION_2024.map((row, i) => (
                <li
                  key={row.slice}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{
                        background: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    {row.short}
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {fmtBn(row.bn)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="DAC total path: five years up, then the first drop"
          subtitle="2019–2024. 2024 disclosed; earlier years estimated from OECD real-term growth rates (+4.0%, +8.3%, +16.8%, +1.2%, then −7.1%)."
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <AreaChart
                data={DAC_TOTAL_PATH}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  domain={[150, 240]}
                />
                <Tooltip
                  formatter={(value) => [fmtBn(Number(value), 1), "DAC ODA"]}
                />
                <Area
                  type="monotone"
                  dataKey="odaBn"
                  name="DAC ODA"
                  stroke="#be123c"
                  fill="#be123c"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Pressure valves that fell in 2024"
          subtitle="In-donor refugee costs, humanitarian, and Ukraine bilateral — ranked by $. Real-term changes vs 2023."
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <BarChart
                data={PRESSURE_LINES}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const row = item?.payload as (typeof PRESSURE_LINES)[0];
                    return [
                      `${fmtBn(Number(value))} (${fmtSignedPct(row.realChangePct)} real)`,
                      row.label,
                    ];
                  }}
                />
                <Bar dataKey="bn" name="USD bn" fill="#e11d48" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Memo blocks: G7 still owns three-quarters of DAC ODA"
        subtitle="OECD Table 1 memo items — ranked by volume."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MEMO_BLOCKS.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {m.label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                {fmtBn(m.bn, 1)}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {m.gniPct != null ? `${fmtPct(m.gniPct)} of GNI` : "no GNI ratio"}
                {m.sharePct != null ? ` · ${fmtPct(m.sharePct, 0)} of DAC` : ""}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Top-12 volume snapshot (unfiltered):{" "}
          {volumeBars.map((d) => d.short).join(" · ")}
        </p>
      </ChartCard>

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p>{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="font-medium text-teal-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
