"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  COUNTRY_GEO,
  HEADLINE,
  HQ_GEOGRAPHY,
  METER_COMPARE,
  REGION_DUMBBELLS,
  REGION_FILTERS,
  REGION_SHARES,
  SOURCE_NOTE,
  UNSC_SEAT_GEO,
  VETO_PRACTICE,
  countriesForRegion,
  fmtPct,
  fmtPp,
  type Region,
} from "@/data/geopolitics-institutions-geography-2026-data";

// viz-types: regional pie, country share bars, vote↔GDP dumbbell, vote×GDP scatter, P5 seats, veto practice, meter compare | layout: default

type ViewId = "regions" | "gaps" | "scatter" | "council";
type MetricId = "imf" | "ibrd" | "gdp";

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

function RegionalPiePanel({ metric }: { metric: MetricId }) {
  const key =
    metric === "imf"
      ? "imfVotePct"
      : metric === "ibrd"
        ? "ibrdVotePct"
        : "gdpPppPct";
  const label =
    metric === "imf"
      ? "IMF vote %"
      : metric === "ibrd"
        ? "IBRD vote %"
        : "PPP GDP %";

  const rows = useMemo(
    () =>
      REGION_SHARES.map((r) => ({
        name: r.short,
        value: r[key],
        fill: r.fill,
      })),
    [key],
  );

  return (
    <div className="h-[340px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={110}
            paddingAngle={2}
          >
            {rows.map((r) => (
              <Cell key={r.name} fill={r.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [fmtPct(Number(value), 1), label]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
        {rows.map((r) => (
          <span key={r.name} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: r.fill }}
            />
            {r.name} ({fmtPct(r.value, 0)})
          </span>
        ))}
      </div>
    </div>
  );
}

function RegionalBarPanel({ metric }: { metric: MetricId }) {
  const key =
    metric === "imf"
      ? "imfVotePct"
      : metric === "ibrd"
        ? "ibrdVotePct"
        : "gdpPppPct";
  const label =
    metric === "imf"
      ? "IMF vote %"
      : metric === "ibrd"
        ? "IBRD vote %"
        : "PPP GDP %";

  const rows = useMemo(
    () =>
      [...REGION_SHARES]
        .map((r) => ({
          short: r.short,
          value: r[key],
          fill: r.fill,
        }))
        .sort((a, b) => b.value - a.value),
    [key],
  );

  return (
    <div className="h-[340px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={72}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            formatter={(value) => [fmtPct(Number(value), 1), label]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {rows.map((r) => (
              <Cell key={r.short} fill={r.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DumbbellPanel() {
  const maxPct = Math.max(
    ...REGION_DUMBBELLS.flatMap((d) => [d.votePct, d.gdpPct]),
    1,
  );

  return (
    <div className="space-y-4 min-h-[320px]">
      <div className="mb-1 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
          IMF vote share
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          PPP GDP share
        </span>
      </div>
      {REGION_DUMBBELLS.map((d) => {
        const voteLeft = (d.votePct / maxPct) * 100;
        const gdpLeft = (d.gdpPct / maxPct) * 100;
        const left = Math.min(voteLeft, gdpLeft);
        const width = Math.abs(gdpLeft - voteLeft);
        return (
          <div
            key={d.id}
            className="grid grid-cols-[88px_1fr_72px] items-center gap-2"
          >
            <div className="text-right text-xs font-semibold text-slate-800">
              {d.short}
            </div>
            <div className="relative h-8 rounded-md bg-slate-50">
              <div
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-slate-300"
                style={{ left: `${left}%`, width: `${width}%` }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 shadow"
                style={{ left: `${voteLeft}%` }}
                title={`Votes: ${fmtPct(d.votePct, 1)}`}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow"
                style={{ left: `${gdpLeft}%` }}
                title={`GDP: ${fmtPct(d.gdpPct, 1)}`}
              />
            </div>
            <div
              className={`text-xs font-medium ${
                d.gapPp < 0 ? "text-rose-600" : "text-emerald-700"
              }`}
            >
              {fmtPp(d.gapPp)}
            </div>
          </div>
        );
      })}
      <p className="pt-2 text-xs text-slate-500">
        Asia-Pacific majors sit ~{fmtPct(HEADLINE.asiaPacImfVotePct, 0)} of IMF votes on ~
        {fmtPct(HEADLINE.asiaPacGdpPppPct, 0)} of PPP GDP (
        {fmtPp(HEADLINE.asiaPacGapPp)}). Europe flips the sign: ~
        {fmtPct(HEADLINE.europeImfVotePct, 0)} of votes on ~
        {fmtPct(HEADLINE.europeGdpPppPct, 0)} of GDP ({fmtPp(HEADLINE.europeGapPp)}).
      </p>
    </div>
  );
}

function CountryBarPanel({ region }: { region: "all" | Region }) {
  const rows = useMemo(() => {
    const list = countriesForRegion(region);
    return [...list].sort((a, b) => b.imfVotePct - a.imfVotePct);
  }, [region]);

  return (
    <div className="h-[340px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={64}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            formatter={(value) => [fmtPct(Number(value), 1), "IMF vote %"]}
            labelFormatter={(l) => String(l)}
          />
          <Bar dataKey="imfVotePct" radius={[0, 4, 4, 0]} maxBarSize={26}>
            {rows.map((r) => (
              <Cell key={r.id} fill={r.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ScatterPanel({ region }: { region: "all" | Region }) {
  const rows = useMemo(() => countriesForRegion(region), [region]);

  return (
    <div className="h-[360px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="gdpPppPct"
            name="PPP GDP %"
            domain={[0, 20]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "PPP GDP share",
              position: "insideBottom",
              offset: -4,
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <YAxis
            type="number"
            dataKey="imfVotePct"
            name="IMF vote %"
            domain={[0, 18]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "IMF vote share",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <ZAxis range={[90, 90]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => [
              fmtPct(Number(value), 1),
              name === "imfVotePct" ? "IMF vote" : "PPP GDP",
            ]}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as
                | (typeof COUNTRY_GEO)[number]
                | undefined;
              return p ? `${p.name} (${fmtPp(p.gapImfPp)})` : "";
            }}
          />
          <Scatter data={rows}>
            {rows.map((r) => (
              <Cell key={r.id} fill={r.fill} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-slate-500">
        Points above the diagonal are over-weighted on votes vs GDP; China and India sit
        far right / mid-height — the geography of under-representation inside Asia-Pacific.
      </p>
    </div>
  );
}

function UnscSeatsPanel() {
  const rows = useMemo(
    () => [...UNSC_SEAT_GEO].sort((a, b) => b.permanentSeats - a.permanentSeats),
    [],
  );

  return (
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#64748b" }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={64}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "P5 seats",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <Tooltip
            formatter={(value) => [String(value), "Permanent seats"]}
          />
          <Bar dataKey="permanentSeats" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {rows.map((r) => (
              <Cell key={r.id} fill={r.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function VetoPracticePanel() {
  const rows = useMemo(
    () => [...VETO_PRACTICE].sort((a, b) => b.vetoes2018_2024 - a.vetoes2018_2024),
    [],
  );

  return (
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows.filter((r) => r.vetoes2018_2024 > 0)}
            dataKey="vetoes2018_2024"
            nameKey="short"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            paddingAngle={2}
          >
            {rows
              .filter((r) => r.vetoes2018_2024 > 0)
              .map((r) => (
                <Cell key={r.id} fill={r.fill} />
              ))}
          </Pie>
          <Tooltip
            formatter={(value, _n, item) => {
              const p = item?.payload as (typeof VETO_PRACTICE)[number] | undefined;
              return [
                `${value} (${p ? fmtPct(p.sharePct, 0) : ""})`,
                "Vetoes 2018–24",
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
        {rows.map((r) => (
          <span key={r.id} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: r.fill }}
            />
            {r.short} ({r.vetoes2018_2024})
          </span>
        ))}
      </div>
    </div>
  );
}

function MeterComparePanel() {
  const rows = useMemo(
    () => [...METER_COMPARE].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  return (
    <div className="h-[320px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 80]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={64}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            formatter={(value, _n, item) => {
              const p = item?.payload as (typeof METER_COMPARE)[number] | undefined;
              return [
                fmtPct(Number(value), 1),
                p ? `${p.label} — ${p.note}` : "Share",
              ];
            }}
          />
          <Bar dataKey="sharePct" radius={[0, 4, 4, 0]} maxBarSize={26}>
            {rows.map((r) => (
              <Cell key={r.id} fill={r.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HqStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {HQ_GEOGRAPHY.map((h) => (
        <div
          key={h.id}
          className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: h.fill }}
            />
            <span className="text-sm font-semibold text-slate-900">{h.short}</span>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-700">
            {h.city} · {h.region}
          </p>
          <p className="mt-1 text-xs text-slate-500">{h.authorityNote}</p>
        </div>
      ))}
    </div>
  );
}

export function GeopoliticsInstitutionsGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [metric, setMetric] = useState<MetricId>("imf");
  const [region, setRegion] = useState<"all" | Region>("all");

  return (
    <div
      className="space-y-4"
      data-viz="geopolitics-institutions-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Institutions &amp; governance — geography lens
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          Asia-Pacific majors hold ~{fmtPct(HEADLINE.asiaPacImfVotePct, 0)} of IMF votes
          on ~{fmtPct(HEADLINE.asiaPacGdpPppPct, 0)} of PPP GDP (
          {fmtPp(HEADLINE.asiaPacGapPp)}); Europe holds ~
          {fmtPct(HEADLINE.europeImfVotePct, 0)} on ~
          {fmtPct(HEADLINE.europeGdpPppPct, 0)} ({fmtPp(HEADLINE.europeGapPp)})
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Europe owns {HEADLINE.europeP5Seats} of 5 UNSC permanent seats (
          {fmtPct(HEADLINE.europeP5SharePct, 0)}); Africa + Middle East own{" "}
          {HEADLINE.africaMeP5Seats}. Russia accounts for ~{HEADLINE.russiaVetoSharePct}%
          of 2018–24 veto uses.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "regions", label: "Regional shares" },
            { id: "gaps", label: "Vote↔GDP gaps" },
            { id: "scatter", label: "Country scatter" },
            { id: "council", label: "Council & HQs" },
          ]}
        />
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "imf", label: "IMF votes" },
              { id: "ibrd", label: "IBRD votes" },
              { id: "gdp", label: "PPP GDP" },
            ]}
          />
        )}
        {(view === "gaps" || view === "scatter") && (
          <ToggleGroup
            label="Region"
            value={region}
            onChange={setRegion}
            options={REGION_FILTERS.map((r) => ({
              id: r.id,
              label: r.label,
            }))}
          />
        )}
      </div>

      {view === "regions" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Regional pie"
            subtitle="Where vote weight (or GDP) sits among majors tip + residual"
          >
            <RegionalPiePanel metric={metric} />
          </ChartCard>
          <ChartCard
            title="Regional share bars"
            subtitle="Same geography as ranked bars — flip Metric to compare meters"
          >
            <RegionalBarPanel metric={metric} />
          </ChartCard>
        </div>
      )}

      {view === "gaps" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Vote↔GDP dumbbells"
            subtitle="IMF vote share versus PPP GDP share by regional tip"
          >
            <DumbbellPanel />
          </ChartCard>
          <ChartCard
            title="Country IMF vote bars"
            subtitle="Filter by Region to see who carries each tip"
          >
            <CountryBarPanel region={region} />
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Country vote × GDP scatter"
          subtitle="Bubble color = region; gap in tooltip (vote − GDP pp)"
        >
          <ScatterPanel region={region} />
        </ChartCard>
      )}

      {view === "council" && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="UNSC permanent seats by region"
              subtitle="Europe holds 60% of P5 seats; Africa and Middle East hold zero"
            >
              <UnscSeatsPanel />
            </ChartCard>
            <ChartCard
              title="Veto practice geography (2018–24)"
              subtitle="Formal P5 equality coexists with unequal use — Russia leads the stack"
            >
              <VetoPracticePanel />
            </ChartCard>
          </div>
          <ChartCard
            title="Cross-meter share ladder"
            subtitle="Regional votes, P5 seat share, veto practice, and US tip inside Americas"
          >
            <MeterComparePanel />
          </ChartCard>
          <ChartCard
            title="Institutional HQ geography"
            subtitle="Bretton Woods + UN campus cluster in the Americas; Geneva and Manila as European / Asia-Pac hubs"
          >
            <HqStrip />
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
