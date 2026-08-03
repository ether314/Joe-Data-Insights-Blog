"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CONCENTRATION_METERS,
  ECONOMY_META,
  GERD_SHARE_PATH,
  HCA_CONTRAST,
  HEADLINE,
  INTENSITY_LEADERS,
  PUB_KEYS,
  PUB_RANK_PATH,
  PUB_SHARE_PATH,
  SOURCE_NOTE,
  SOURCES,
  STREAM_KEYS,
  fmtBn,
  fmtPct,
  rankedGerdVolumes,
  type EconomyId,
} from "@/data/measurement-science-research-2026-data";

// viz-types: GERD share streamgraph, publication rank bump, volume bars, HCA×volume scatter, intensity bars | layout: default

type Panel = "stream" | "bump" | "volumes" | "impact" | "intensity";
type StreamMetric = "share" | "usChina";
type BumpMetric = "rank" | "share";

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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MeasurementScienceResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("stream");
  const [streamMetric, setStreamMetric] = useState<StreamMetric>("share");
  const [bumpMetric, setBumpMetric] = useState<BumpMetric>("rank");

  const volumes = useMemo(() => rankedGerdVolumes(), []);

  const usChinaPath = useMemo(
    () =>
      GERD_SHARE_PATH.map((r) => ({
        year: r.year,
        usChina: r.usa + r.chn,
        usa: r.usa,
        chn: r.chn,
        rest: 100 - r.usa - r.chn,
        confidence: r.confidence,
      })),
    [],
  );

  const hcaScatter = useMemo(
    () =>
      HCA_CONTRAST.map((r) => ({
        ...r,
        short: ECONOMY_META[r.id].short,
        color: ECONOMY_META[r.id].color,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="measurement-science-research-2026">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Measurement &amp; science
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Where progress is funded and published — and how hard it concentrates
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Global GERD hit about {fmtBn(HEADLINE.globalGerd2022Tn * 1000)} PPP in 2022. The US (
          {fmtPct(HEADLINE.usShare2022Pct)}) and China ({fmtPct(HEADLINE.chinaShare2022Pct)}) together
          hold {fmtPct(HEADLINE.usChinaShare2022Pct)} of that stack; the top eight economies hold{" "}
          {fmtPct(HEADLINE.top8Share2022Pct)}. On the publication side, six countries produce more than
          half of peer-reviewed S&amp;E articles — with China leading volume since{" "}
          {HEADLINE.pubsOvertakeYear}.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "US+China GERD", v: fmtPct(HEADLINE.usChinaShare2022Pct) },
            { k: "Top-8 GERD", v: fmtPct(HEADLINE.top8Share2022Pct) },
            { k: "China pubs", v: fmtPct(HEADLINE.chinaPubs2022Pct) },
            { k: "US pubs", v: fmtPct(HEADLINE.usPubs2022Pct) },
          ].map((m) => (
            <div key={m.k} className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <div className="text-[11px] uppercase tracking-wide text-slate-400">{m.k}</div>
              <div className="text-xl font-bold text-white">{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "stream", label: "GERD stream" },
            { id: "bump", label: "Pub bump" },
            { id: "volumes", label: "GERD volumes" },
            { id: "impact", label: "Impact vs volume" },
            { id: "intensity", label: "R&D intensity" },
          ]}
        />
        {panel === "stream" && (
          <ToggleGroup
            label="View"
            value={streamMetric}
            onChange={setStreamMetric}
            options={[
              { id: "share", label: "Full stack" },
              { id: "usChina", label: "US–China duopoly" },
            ]}
          />
        )}
        {panel === "bump" && (
          <ToggleGroup
            label="Metric"
            value={bumpMetric}
            onChange={setBumpMetric}
            options={[
              { id: "rank", label: "Rank (bump)" },
              { id: "share", label: "Share %" },
            ]}
          />
        )}
      </div>

      {panel === "stream" && (
        <ChartCard
          title="GERD share streamgraph — who funds the world’s research?"
          subtitle="Percent of OECD-coverage global GERD (PPP). Disclosed anchors at 2000, 2010, 2022; mid years estimated."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              {streamMetric === "share" ? (
                <AreaChart data={GERD_SHARE_PATH} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      ECONOMY_META[name as EconomyId]?.short ?? String(name),
                    ]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  {STREAM_KEYS.map((k) => (
                    <Area
                      key={k}
                      type="monotone"
                      dataKey={k}
                      stackId="1"
                      stroke={ECONOMY_META[k].color}
                      fill={ECONOMY_META[k].color}
                      fillOpacity={0.75}
                      name={k}
                    />
                  ))}
                </AreaChart>
              ) : (
                <AreaChart data={usChinaPath} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      name === "usChina" ? "US+China" : name === "rest" ? "Rest of world" : String(name),
                    ]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="usa"
                    stackId="1"
                    stroke={ECONOMY_META.usa.color}
                    fill={ECONOMY_META.usa.color}
                    fillOpacity={0.85}
                    name="usa"
                  />
                  <Area
                    type="monotone"
                    dataKey="chn"
                    stackId="1"
                    stroke={ECONOMY_META.chn.color}
                    fill={ECONOMY_META.chn.color}
                    fillOpacity={0.85}
                    name="chn"
                  />
                  <Area
                    type="monotone"
                    dataKey="rest"
                    stackId="1"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.45}
                    name="rest"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {streamMetric === "share"
              ? STREAM_KEYS.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: ECONOMY_META[k].color }}
                    />
                    {ECONOMY_META[k].short}
                  </span>
                ))
              : [
                  { c: ECONOMY_META.usa.color, l: "US" },
                  { c: ECONOMY_META.chn.color, l: "China" },
                  { c: "#94a3b8", l: "Rest" },
                ].map((x) => (
                  <span key={x.l} className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: x.c }} />
                    {x.l}
                  </span>
                ))}
          </div>
        </ChartCard>
      )}

      {panel === "bump" && (
        <ChartCard
          title={
            bumpMetric === "rank"
              ? "Publication rank bump — who leads S&E article volume?"
              : "Publication share lines — volume concentration over time"
          }
          subtitle="Fractional-count peer-reviewed S&E publications. China overtakes the US in volume around 2016; 2022 shares disclosed (CN 27%, US 14%)."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              {bumpMetric === "rank" ? (
                <LineChart data={PUB_RANK_PATH} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    reversed
                    domain={[1, 6]}
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tick={{ fontSize: 12 }}
                    width={28}
                    label={{ value: "Rank", angle: -90, position: "insideLeft", offset: 10 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `#${value}`,
                      ECONOMY_META[name as EconomyId]?.short ?? String(name),
                    ]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  {PUB_KEYS.map((k) => (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      stroke={ECONOMY_META[k].color}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      name={k}
                    />
                  ))}
                </LineChart>
              ) : (
                <LineChart data={PUB_SHARE_PATH} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                    width={40}
                    domain={[0, 30]}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      ECONOMY_META[name as EconomyId]?.short ?? String(name),
                    ]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  {PUB_KEYS.map((k) => (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      stroke={ECONOMY_META[k].color}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      name={k}
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {PUB_KEYS.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: ECONOMY_META[k].color }}
                />
                {ECONOMY_META[k].short}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "volumes" && (
        <ChartCard
          title="2022 GERD volumes — the dollar stack behind the shares"
          subtitle="Current PPP $bn. US $923B and China $812B dwarf the next tier; together they exceed half of global R&D."
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={volumes.map((r) => ({
                  ...r,
                  short: ECONOMY_META[r.id].short,
                  color: ECONOMY_META[r.id].color,
                }))}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="short" width={64} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "gerdBn") return [fmtBn(Number(value), 1), "GERD"];
                    if (name === "sharePct") return [fmtPct(Number(value)), "World share"];
                    return [String(value), String(name)];
                  }}
                />
                <Bar dataKey="gerdBn" name="gerdBn" radius={[0, 6, 6, 0]}>
                  {volumes.map((r) => (
                    <Cell key={r.id} fill={ECONOMY_META[r.id].color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "impact" && (
        <ChartCard
          title="Impact vs volume — highly cited articles vs publication share"
          subtitle="HCA index ≈ relative citation impact (world = 1.0). Bubble size scales with publication share. Volume leadership ≠ citation leadership."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="pubShare2022Pct"
                  name="Pub share"
                  unit="%"
                  tick={{ fontSize: 12 }}
                  domain={[0, 30]}
                  label={{ value: "2022 publication share %", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                  type="number"
                  dataKey="hcaIndex"
                  name="HCA"
                  tick={{ fontSize: 12 }}
                  domain={[0.5, 2.4]}
                  label={{ value: "HCA index", angle: -90, position: "insideLeft" }}
                />
                <ZAxis type="number" dataKey="pubShare2022Pct" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "Pub share" || name === "pubShare2022Pct")
                      return [`${Number(value).toFixed(0)}%`, "Pub share"];
                    if (name === "HCA" || name === "hcaIndex")
                      return [Number(value).toFixed(1), "HCA index"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { short?: string } | undefined;
                    return p?.short ?? "";
                  }}
                />
                <Scatter data={hcaScatter} name="Economies">
                  {hcaScatter.map((r) => (
                    <Cell key={r.id} fill={r.color} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {hcaScatter.map((r) => (
              <span key={r.id} className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                {r.short} · HCA {r.hcaIndex.toFixed(1)}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "intensity" && (
        <ChartCard
          title="R&D intensity — GERD as a share of GDP"
          subtitle="Israel (6.0%) and Korea (5.2%) out-intensity the large absolute spenders. China at 2.6% is still below the US (3.6%) despite near-parity on dollars."
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={[...INTENSITY_LEADERS].sort((a, b) => b.intensityPct - a.intensityPct)}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                  domain={[0, 7]}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "GERD / GDP"]}
                />
                <Bar dataKey="intensityPct" radius={[6, 6, 0, 0]}>
                  {[...INTENSITY_LEADERS]
                    .sort((a, b) => b.intensityPct - a.intensityPct)
                    .map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Concentration meter</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Detail</th>
            </tr>
          </thead>
          <tbody>
            {CONCENTRATION_METERS.map((m) => (
              <tr key={m.label} className="border-t border-slate-100">
                <td className="px-4 py-2.5 font-medium text-slate-800">{m.label}</td>
                <td className="px-4 py-2.5 font-semibold text-slate-900">{m.value}</td>
                <td className="px-4 py-2.5 text-slate-600">{m.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a href={s.url} className="underline hover:text-slate-700" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
