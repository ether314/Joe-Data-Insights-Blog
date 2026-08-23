"use client";

import { useMemo, useState } from "react";
import {
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
  BF_SHARE_LADDER,
  GLOBAL_ROUTE_MIX,
  HEADLINE,
  INTENSITY_PATH,
  PEER_CONTRAST,
  ROUTE_STACK,
  SOURCE_NOTE,
  chinaIndiaBfDominance,
  fmtMt,
  fmtPct,
  rankedCountries,
  regionProcessRollup,
  scatterPoints,
  type RankLens,
  type RegionFilter,
} from "@/data/blast-furnace-vs-eaf-steel-by-country-2026-data";

// viz-types: stacked BF/EAF bars, BF-share ladder, peer contrast bars, global route donut, intensity path composed, BF-share vs intensity scatter | layout: default

type ViewId = "routes" | "peers" | "path" | "scatter";

const BF = "#b45309";
const EAF = "#0e7490";
const NAVY = "#0f172a";
const SLATE = "#64748b";
const AMBER = "#d97706";

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

export function BlastFurnaceVsEafSteelByCountry2026Dashboard() {
  const [view, setView] = useState<ViewId>("routes");
  const [lens, setLens] = useState<RankLens>("bfShare");
  const [region, setRegion] = useState<RegionFilter>("all");

  const dominance = useMemo(() => chinaIndiaBfDominance(), []);
  const ranked = useMemo(() => rankedCountries(lens, region), [lens, region]);
  const barData = useMemo(
    () =>
      ranked.slice(0, 12).map((r) => ({
        name: r.label,
        value:
          lens === "bfShare"
            ? r.bfSharePct
            : lens === "eafShare"
              ? r.eafSharePct
              : lens === "crude"
                ? r.crudeMt
                : r.processMt,
        fill:
          r.id === "china" || r.id === "india"
            ? BF
            : r.id === "usa" || r.id === "italy" || r.id === "turkey"
              ? EAF
              : SLATE,
      })),
    [ranked, lens],
  );

  const scatter = useMemo(() => scatterPoints(), []);
  const regions = useMemo(() => regionProcessRollup(), []);

  const yLabel =
    lens === "bfShare"
      ? "BF / BOF share (%)"
      : lens === "eafShare"
        ? "EAF share (%)"
        : lens === "crude"
          ? "Crude steel (Mt)"
          : "Residual process CO₂ (Mt)";

  const peerBars = PEER_CONTRAST.map((p) => ({
    name: p.label,
    bf: p.bfSharePct,
    eaf: p.eafSharePct,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="blast-furnace-vs-eaf-steel-by-country-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/90">
          Heavy materials · steel route mix
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China BF share {fmtPct(HEADLINE.chinaBfSharePct)} · US EAF{" "}
          {fmtPct(HEADLINE.usEafSharePct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Globally about {fmtPct(HEADLINE.globalBfSharePct)} of crude steel still
          runs through blast-furnace / basic-oxygen converters. China alone sits
          near {fmtPct(HEADLINE.chinaBfSharePct)} BF; India near{" "}
          {fmtPct(HEADLINE.indiaBfSharePct)}. The United States is the inverse —
          roughly {fmtPct(HEADLINE.usEafSharePct)} electric-arc — while the EU-27
          sits mid-pack at {fmtPct(HEADLINE.eu27EafSharePct)} EAF. That route
          split, not scrap slogans, sets residual process emissions.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              Global BF share
            </dt>
            <dd className="text-lg font-semibold">
              {fmtPct(HEADLINE.globalBfSharePct)}
            </dd>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              China BF share
            </dt>
            <dd className="text-lg font-semibold">
              {fmtPct(HEADLINE.chinaBfSharePct)}
            </dd>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              US EAF share
            </dt>
            <dd className="text-lg font-semibold">
              {fmtPct(HEADLINE.usEafSharePct)}
            </dd>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              CN+IN of panel BF
            </dt>
            <dd className="text-lg font-semibold">{fmtPct(dominance.sharePct)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "routes", label: "Route stack & ladder" },
            { id: "peers", label: "Peer contrast" },
            { id: "path", label: "Intensity path" },
            { id: "scatter", label: "Scatter" },
          ]}
        />
        {view === "routes" && (
          <>
            <ToggleGroup<RankLens>
              label="Rank by"
              value={lens}
              onChange={setLens}
              options={[
                { id: "bfShare", label: "BF share" },
                { id: "eafShare", label: "EAF share" },
                { id: "crude", label: "Crude Mt" },
                { id: "processMt", label: "Process Mt" },
              ]}
            />
            <ToggleGroup<RegionFilter>
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                { id: "all", label: "All" },
                { id: "asia", label: "Asia" },
                { id: "americas", label: "Americas" },
                { id: "emea", label: "EMEA" },
              ]}
            />
          </>
        )}
      </div>

      {view === "routes" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="BF vs EAF tonnage stack"
            subtitle="Top producers — crude Mt by route family"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ROUTE_STACK} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fill: NAVY, fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bfMt" name="BF / BOF Mt" stackId="a" fill={BF} />
                  <Bar dataKey="eafMt" name="EAF Mt" stackId="a" fill={EAF} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Rank lens"
            subtitle={`${yLabel} · region filter: ${region}`}
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fill: NAVY, fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name={yLabel} radius={[0, 4, 4, 0]}>
                    {barData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="BF share ladder"
            subtitle="Oxygen-converter / BF-BOF share of crude (%)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BF_SHARE_LADDER.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    height={70}
                    tick={{ fill: SLATE, fontSize: 10 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip />
                  <Bar dataKey="bfSharePct" name="BF share %" fill={BF} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Global route mix"
            subtitle={`~${HEADLINE.year}e · worldsteel-order process split`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...GLOBAL_ROUTE_MIX]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {GLOBAL_ROUTE_MIX.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "peers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="China / India vs US / EU-27"
            subtitle="BF share (amber) vs EAF share (teal) of crude"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: NAVY, fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bf" name="BF / BOF %" fill={BF} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="eaf" name="EAF %" fill={EAF} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regional process residual"
            subtitle="Desk process Mt roll-up from route intensities"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: NAVY, fontSize: 12 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="processMt" name="Process Mt" fill={AMBER} />
                  <Bar dataKey="crudeMt" name="Crude Mt" fill={EAF} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <ChartCard
          title="Global intensity vs BF share path"
          subtitle="Illustrative desk indices — intensity t CO₂/t crude · BF share %"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={[...INTENSITY_PATH]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  domain={[1.6, 2.0]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  domain={[65, 75]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="bfSharePct"
                  name="BF share %"
                  fill={BF}
                  opacity={0.35}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="globalIntensity"
                  name="Intensity t/t"
                  stroke={EAF}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="BF share vs residual intensity"
          subtitle="Bubble size ∝ crude Mt · IEA-style route-weighted intensity"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="bfSharePct"
                  name="BF share %"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="intensityTPerT"
                  name="Intensity"
                  unit=" t/t"
                  domain={[0.6, 2.2]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="crudeMt" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Countries" data={scatter} fill={BF}>
                  {scatter.map((p) => (
                    <Cell
                      key={p.id}
                      fill={
                        p.id === "china" || p.id === "india"
                          ? BF
                          : p.id === "usa" || p.id === "italy" || p.id === "turkey"
                            ? EAF
                            : SLATE
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-xs text-slate-400">
        BF intensity anchor {HEADLINE.bfIntensityTPerT} t/t · scrap-EAF{" "}
        {HEADLINE.scrapEafIntensityTPerT} t/t · China+India BF tonnage in panel{" "}
        {fmtMt(dominance.chinaIndiaBfMt)} of {fmtMt(dominance.panelBfMt)}.
      </p>
    </div>
  );
}
