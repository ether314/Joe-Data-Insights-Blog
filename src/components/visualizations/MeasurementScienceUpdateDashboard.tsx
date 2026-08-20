"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
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
  CONCENTRATION_METERS,
  ECONOMY_META,
  GERD_SHARE_PATH,
  HCA_SHARES,
  HEADLINE,
  INTENSITY_LEADERS,
  PUB_VINTAGE,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_VOLUMES,
  fmtBn,
  fmtPct,
  fmtPp,
  rankedShareDeltas,
  volumeDeltas,
} from "@/data/measurement-science-update-2026-data";

// viz-types: share Δ diverging bars, prior→new volume dumbbell, GERD share path, HCA×pubs scatter, intensity paired bars | layout: default
// viz-plan: panel + metric/view controls; vintage delta first; no KPI+bar clone

type Panel = "deltas" | "volumes" | "path" | "pubs" | "impact" | "intensity";
type PathView = "shares" | "duopoly";
type VolumeMetric = "bn" | "pct";

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
                ? "bg-slate-800 text-white"
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

export function MeasurementScienceUpdateDashboard() {
  const [panel, setPanel] = useState<Panel>("deltas");
  const [pathView, setPathView] = useState<PathView>("shares");
  const [volumeMetric, setVolumeMetric] = useState<VolumeMetric>("bn");

  const deltas = useMemo(() => rankedShareDeltas(), []);
  const volDeltas = useMemo(() => volumeDeltas(), []);

  const dumbbell = useMemo(
    () =>
      volDeltas.map((r) => ({
        short: r.short,
        color: r.color,
        prior: volumeMetric === "bn" ? r.gerd2022Bn : r.share2022Pct,
        neu: volumeMetric === "bn" ? r.gerd2024Bn : r.share2024Pct,
        delta: volumeMetric === "bn" ? r.deltaBn : (r.share2024Pct ?? 0) - (r.share2022Pct ?? 0),
      })),
    [volDeltas, volumeMetric],
  );

  const pathData = useMemo(
    () =>
      GERD_SHARE_PATH.map((r) => ({
        year: r.year,
        usa: r.usa,
        chn: r.chn,
        eu27: r.eu27,
        jpn: r.jpn,
        kor: r.kor,
        usChina: r.usa + r.chn,
        rest: 100 - r.usa - r.chn,
        confidence: r.confidence,
      })),
    [],
  );

  const pubDumbbell = useMemo(
    () =>
      PUB_VINTAGE.map((r) => ({
        short: r.short,
        color: r.color,
        prior: r.share2022Pct,
        neu: r.share2024Pct,
        delta: r.deltaPp,
      })),
    [],
  );

  const intensityPaired = useMemo(
    () =>
      [...INTENSITY_LEADERS]
        .sort((a, b) => b.intensity2024Pct - a.intensity2024Pct)
        .map((r) => ({
          short: r.short,
          color: r.color,
          y2022: r.intensity2022Pct,
          y2024: r.intensity2024Pct,
        })),
    [],
  );

  const hcaScatter = useMemo(
    () =>
      HCA_SHARES.filter((r) => r.pubShare2024Pct != null).map((r) => ({
        ...r,
        x: r.pubShare2024Pct as number,
        y: r.hcaSharePct,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="measurement-science-update-2026">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Vintage update · 2022 → 2024
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China overtakes the US on PPP R&amp;D share — duopoly tightens to{" "}
          {fmtPct(HEADLINE.usChinaShare2024Pct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          NSF/NSB State of U.S. S&amp;E 2026 prints worldwide GERD at{" "}
          {fmtBn(HEADLINE.globalGerd2024Tn * 1000)} in 2024. China holds{" "}
          {fmtPct(HEADLINE.chinaShare2024Pct)} and the US {fmtPct(HEADLINE.usShare2024Pct)}{" "}
          — a flip from the prior research post&apos;s 2022 vintage (US{" "}
          {fmtPct(HEADLINE.usShare2022Pct)}, China {fmtPct(HEADLINE.chinaShare2022Pct)}).
          Combined share rises {fmtPct(HEADLINE.usChinaShare2022Pct)} →{" "}
          {fmtPct(HEADLINE.usChinaShare2024Pct)}. On publications, China–US–India alone are
          half of world output.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              k: "US+China GERD",
              v: fmtPct(HEADLINE.usChinaShare2024Pct),
              d: fmtPp(HEADLINE.usChinaDeltaPp, 0),
            },
            {
              k: "China share",
              v: fmtPct(HEADLINE.chinaShare2024Pct),
              d: "+3 pp vs 2022",
            },
            {
              k: "US share",
              v: fmtPct(HEADLINE.usShare2024Pct),
              d: "−1 pp vs 2022",
            },
            {
              k: "World GERD",
              v: `$${HEADLINE.globalGerd2024Tn.toFixed(2)}T`,
              d: `+$${HEADLINE.globalGerdDeltaTn.toFixed(2)}T`,
            },
          ].map((m) => (
            <div
              key={m.k}
              className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10"
            >
              <div className="text-[11px] uppercase tracking-wide text-slate-400">{m.k}</div>
              <div className="text-xl font-bold text-white">{m.v}</div>
              <div className="text-xs text-sky-300">{m.d}</div>
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
            { id: "deltas", label: "Share Δ" },
            { id: "volumes", label: "Volume bridge" },
            { id: "path", label: "Share path" },
            { id: "pubs", label: "Pubs vintage" },
            { id: "impact", label: "HCA vs volume" },
            { id: "intensity", label: "Intensity" },
          ]}
        />
        {panel === "path" && (
          <ToggleGroup
            label="View"
            value={pathView}
            onChange={setPathView}
            options={[
              { id: "shares", label: "Full stack" },
              { id: "duopoly", label: "US–China" },
            ]}
          />
        )}
        {panel === "volumes" && (
          <ToggleGroup
            label="Metric"
            value={volumeMetric}
            onChange={setVolumeMetric}
            options={[
              { id: "bn", label: "PPP $bn" },
              { id: "pct", label: "Share %" },
            ]}
          />
        )}
      </div>

      {panel === "deltas" && (
        <ChartCard
          title="GERD share change, 2022 → 2024"
          subtitle="Percentage-point delta vs the prior research post’s 2022 vintage"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={deltas}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                  domain={[-1.5, 3.5]}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={64}
                  tick={{ fontSize: 12, fill: "#334155" }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => [fmtPp(Number(value), 1), "Δ share"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label ?? ""
                  }
                />
                <Bar dataKey="deltaPp" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {deltas.map((d) => (
                    <Cell key={d.id} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            China +3 pp and the US −1 pp produce the first China-led PPP GERD ranking in
            this Indicators framing.
          </p>
        </ChartCard>
      )}

      {panel === "volumes" && (
        <ChartCard
          title={
            volumeMetric === "bn"
              ? "GERD volumes: 2022 → 2024 (PPP $bn)"
              : "GERD shares: 2022 → 2024 (%)"
          }
          subtitle="Dumbbell bridge — open circle = prior vintage, filled = 2024 print"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart
                data={dumbbell}
                layout="vertical"
                margin={{ top: 8, right: 32, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) =>
                    volumeMetric === "bn" ? `$${v}` : `${v}%`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={64}
                  tick={{ fontSize: 12, fill: "#334155" }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (volumeMetric === "bn") {
                      return [fmtBn(n), name === "prior" ? "2022" : "2024"];
                    }
                    return [fmtPct(n, 1), name === "prior" ? "2022" : "2024"];
                  }}
                />
                <Bar dataKey="prior" fill="#cbd5e1" barSize={2} radius={2} />
                <Bar dataKey="neu" fill="#0f172a" barSize={2} radius={2} />
                <Scatter dataKey="prior" fill="#94a3b8">
                  {dumbbell.map((d) => (
                    <Cell key={`p-${d.short}`} fill="#94a3b8" />
                  ))}
                </Scatter>
                <Scatter dataKey="neu">
                  {dumbbell.map((d) => (
                    <Cell key={`n-${d.short}`} fill={d.color} />
                  ))}
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {volDeltas.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-700">{r.short}</span>
                <span className="tabular-nums text-slate-500">
                  {fmtBn(r.gerd2022Bn as number)} → {fmtBn(r.gerd2024Bn as number)}{" "}
                  <span className="text-sky-700">(+{r.deltaPct.toFixed(0)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "path" && (
        <ChartCard
          title={
            pathView === "shares"
              ? "Global GERD share path (2000–2024)"
              : "US–China combined share path"
          }
          subtitle="Disclosed anchors at 2000, 2010, 2022, 2024 — State of S&E 2026 extends the series"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={pathData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `${v}%`}
                  domain={pathView === "duopoly" ? [40, 65] : [0, 45]}
                />
                <Tooltip
                  formatter={(value, name) => [fmtPct(Number(value), 1), String(name)]}
                />
                {pathView === "shares" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="chn"
                      name="China"
                      stroke={ECONOMY_META.chn.color}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usa"
                      name="US"
                      stroke={ECONOMY_META.usa.color}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="eu27"
                      name="EU-27"
                      stroke={ECONOMY_META.eu27.color}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="jpn"
                      name="Japan"
                      stroke={ECONOMY_META.jpn.color}
                      strokeWidth={1.5}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="kor"
                      name="Korea"
                      stroke={ECONOMY_META.kor.color}
                      strokeWidth={1.5}
                      dot={{ r: 3 }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="usChina"
                      name="US+China"
                      stroke="#f8fafc"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#38bdf8" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usa"
                      name="US"
                      stroke={ECONOMY_META.usa.color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="chn"
                      name="China"
                      stroke={ECONOMY_META.chn.color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "pubs" && (
        <ChartCard
          title="S&E publication shares: 2022 → 2024"
          subtitle="China / US / India — three countries now = 50% of world fractional-count output"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={pubDumbbell}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 12, fill: "#334155" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value), 0),
                    name === "prior" ? "2022 share" : "2024 share",
                  ]}
                />
                <Bar dataKey="prior" name="prior" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neu" name="neu" radius={[4, 4, 0, 0]}>
                  {pubDumbbell.map((d) => (
                    <Cell key={d.short} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            World output reached ~{HEADLINE.worldPubs2024M}M articles in 2024. China{" "}
            {fmtPct(HEADLINE.chinaPubs2024Pct)} / US {fmtPct(HEADLINE.usPubs2024Pct)} / India{" "}
            {fmtPct(HEADLINE.indiaPubs2024Pct)}.
          </p>
        </ChartCard>
      )}

      {panel === "impact" && (
        <ChartCard
          title="Impact vs volume — HCA share × 2024 publication share"
          subtitle="HCA = share of articles in the top 1% most-cited (2022 articles); pubs = 2024 volume share"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Pub share"
                  unit="%"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "2024 publication share (%)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="HCA"
                  unit="%"
                  domain={[1.0, 1.9]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "HCA share of pubs (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <ZAxis range={[120, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    name === "x" ? "Pub share" : "HCA share",
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label ?? ""
                  }
                />
                <Scatter data={hcaScatter}>
                  {hcaScatter.map((d) => (
                    <Cell key={d.id} fill={d.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            US still punches above volume on highly cited articles (1.7% HCA share vs 12%
            of pubs). China&apos;s HCA share rose to 1.3% — progress, not parity with US
            influence.
          </p>
        </ChartCard>
      )}

      {panel === "intensity" && (
        <ChartCard
          title="R&D intensity (GERD / GDP %): 2022 vs 2024"
          subtitle="Korea and Taiwan remain commitment leaders; US intensity eases slightly"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={intensityPaired}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 12, fill: "#334155" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value), 1),
                    name === "y2022" ? "2022" : "2024",
                  ]}
                />
                <Bar dataKey="y2022" name="y2022" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2024" name="y2024" radius={[4, 4, 0, 0]}>
                  {intensityPaired.map((d) => (
                    <Cell key={d.short} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Meter</th>
              <th className="px-4 py-3 font-semibold">2022 (prior)</th>
              <th className="px-4 py-3 font-semibold">2024 (new)</th>
              <th className="px-4 py-3 font-semibold">Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {CONCENTRATION_METERS.map((m) => (
              <tr key={m.label}>
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {m.label}
                  <div className="text-xs font-normal text-slate-450 text-slate-500">
                    {m.detail}
                  </div>
                </td>
                <td className="px-4 py-2.5 tabular-nums text-slate-600">{m.prior}</td>
                <td className="px-4 py-2.5 tabular-nums font-semibold text-slate-900">
                  {m.neu}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-sky-700">{m.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-700">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
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
        <p className="mt-2 text-slate-500">
          Economies without 2024 dollar prints in the State of S&amp;E summary (UK, France,
          Taiwan volumes) are omitted from the volume bridge; share and intensity panels
          use disclosed figures only. EU-27 is a bloc, not an individual top-8 member.
          Rows in the path chart: {VINTAGE_VOLUMES.length} economies with volume detail.
        </p>
      </div>
    </div>
  );
}
