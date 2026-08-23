"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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
  HEADLINE,
  SHARE_PATH,
  SOURCE_NOTE,
  countryBars,
  fmtPct,
  fmtTn,
  gapBars,
  intensityScatter,
  meterBars,
  regionBars,
  regionPie,
  type ShareLens,
  usStateBars,
} from "@/data/measurement-science-geography-2026-data";

// viz-types: country bars+pie, region blocs, share path area+line, intensity×share scatter, funding-output gap bars, US state ladder, meter compare | layout: default

type ViewId = "countries" | "regions" | "paths" | "mismatch";
type RegionFilter =
  | "all"
  | "East Asia"
  | "North America"
  | "Europe"
  | "South Asia";
type StateMetric = "share" | "dollars" | "intensity";
type PathLens = "gerd" | "pubs" | "blocs";

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

const LENS_LABEL: Record<ShareLens, string> = {
  gerd: "GERD PPP",
  pubs: "Publications",
  cet: "CET AI patents",
  kti: "KTI value-added",
  uspto: "USPTO utility",
};

export function MeasurementScienceGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("countries");
  const [lens, setLens] = useState<ShareLens>("gerd");
  const [regionLens, setRegionLens] = useState<ShareLens>("gerd");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [pathLens, setPathLens] = useState<PathLens>("gerd");
  const [stateMetric, setStateMetric] = useState<StateMetric>("share");
  const [scatterMetric, setScatterMetric] = useState<"gerd" | "pubs">("gerd");

  const bars = useMemo(() => countryBars(lens), [lens]);
  const pie = useMemo(() => regionPie(lens), [lens]);
  const regions = useMemo(() => regionBars(regionLens), [regionLens]);
  const regionPieData = useMemo(
    () => regionPie(regionLens),
    [regionLens],
  );
  const scatter = useMemo(
    () => intensityScatter(regionFilter),
    [regionFilter],
  );
  const gaps = useMemo(() => gapBars(), []);
  const meters = useMemo(() => meterBars(), []);
  const states = useMemo(() => usStateBars(stateMetric), [stateMetric]);

  return (
    <div
      className="space-y-6"
      data-viz="measurement-science-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Measurement &amp; science — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where R&amp;D funding, papers, and patents sit on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          World GERD is ~{fmtTn(HEADLINE.gerdWorldTn)} PPP. {HEADLINE.gerdTop1Label}{" "}
          holds {fmtPct(HEADLINE.gerdTop1Pct)} — a {HEADLINE.gerdGapPp} pp knife-edge
          over the US ({fmtPct(HEADLINE.gerdUsPct)}). Publications tip harder to China
          ({fmtPct(HEADLINE.pubsTop1Pct)}), CET AI patents tip to ~{fmtPct(HEADLINE.cetAiTop1Pct, 0)},
          while KTI value-added still crowns the US at {fmtPct(HEADLINE.ktiTop1Pct, 0)}.
          Funding, output, and patents are four different maps.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "China GERD share",
              value: fmtPct(HEADLINE.gerdTop1Pct),
            },
            {
              label: "East Asia GERD",
              value: fmtPct(HEADLINE.eastAsiaGerdPct),
            },
            {
              label: "China pubs tip",
              value: fmtPct(HEADLINE.pubsTop1Pct, 0),
            },
            {
              label: "CET AI Top-1",
              value: fmtPct(HEADLINE.cetAiTop1Pct, 0),
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
            { id: "countries", label: "Countries" },
            { id: "regions", label: "Regions" },
            { id: "paths", label: "Share paths" },
            { id: "mismatch", label: "Funding vs output" },
          ]}
        />
      </div>

      {view === "countries" && (
        <>
          <ToggleGroup
            label="Perimeter"
            value={lens}
            onChange={setLens}
            options={[
              { id: "gerd", label: "GERD PPP" },
              { id: "pubs", label: "Publications" },
              { id: "cet", label: "CET AI patents" },
              { id: "kti", label: "KTI VA" },
              { id: "uspto", label: "USPTO utility" },
            ]}
          />
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="min-w-0 lg:col-span-3">
              <ChartCard
                title={`${LENS_LABEL[lens]} — country shares`}
                subtitle="Toggle perimeter to see Tip-1 relocate (or not)"
              >
                <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bars} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={56}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(v) => [
                          `${Number(v).toFixed(1)}%`,
                          "Share",
                        ]}
                      />
                      <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                        {bars.map((d) => (
                          <Cell key={d.name} fill={d.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
            <div className="min-w-0 lg:col-span-2">
              <ChartCard
                title="Regional pie (same perimeter)"
                subtitle="Bloc roll-up of the country ladder"
              >
                <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {pie.map((d) => (
                          <Cell key={d.name} fill={d.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [
                          `${Number(v).toFixed(1)}%`,
                          "Share",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
          <ChartCard
            title="Meter compare — Top-1 vs Top-3 by perimeter"
            subtitle="Same theme, five tip geometries"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meters}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="top1" name="Top-1 %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top3" name="Top-3 %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "regions" && (
        <>
          <ToggleGroup
            label="Perimeter"
            value={regionLens}
            onChange={setRegionLens}
            options={[
              { id: "gerd", label: "GERD PPP" },
              { id: "pubs", label: "Publications" },
              { id: "cet", label: "CET AI patents" },
              { id: "kti", label: "KTI VA" },
            ]}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title={`Regional blocs — ${LENS_LABEL[regionLens]}`}
              subtitle={`East Asia GERD tip ~${fmtPct(HEADLINE.eastAsiaGerdPct)} of world`}
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]}
                    />
                    <Bar dataKey="share" radius={[4, 4, 0, 0]}>
                      {regions.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="Bloc composition"
              subtitle="Same perimeter as donut"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {regionPieData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <ToggleGroup
            label="US states metric"
            value={stateMetric}
            onChange={setStateMetric}
            options={[
              { id: "share", label: "Share of US %" },
              { id: "dollars", label: "Dollars ($B)" },
              { id: "intensity", label: "Intensity %" },
            ]}
          />
          <ChartCard
            title="Inside the US tip — state R&D geography"
            subtitle="Shares of US domestic R&D (not world GERD). CA alone ~22%."
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={states}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {states.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "paths" && (
        <>
          <ToggleGroup
            label="Path"
            value={pathLens}
            onChange={setPathLens}
            options={[
              { id: "gerd", label: "China vs US GERD" },
              { id: "pubs", label: "China vs US pubs" },
              { id: "blocs", label: "East Asia vs N. America" },
            ]}
          />
          <ChartCard
            title="Share paths 2010–2024"
            subtitle="Geography thickening: China closes the GERD knife-edge; pubs tip earlier"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SHARE_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                    domain={[0, 45]}
                  />
                  <Tooltip />
                  <Legend />
                  {pathLens === "gerd" && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="chinaGerdPct"
                        name="China GERD %"
                        stroke="#f43f5e"
                        fill="#f43f5e33"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="usGerdPct"
                        name="US GERD %"
                        stroke="#0ea5e9"
                        fill="#0ea5e933"
                        strokeWidth={2}
                      />
                    </>
                  )}
                  {pathLens === "pubs" && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="chinaPubsPct"
                        name="China pubs %"
                        stroke="#f59e0b"
                        fill="#f59e0b33"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="usPubsPct"
                        name="US pubs %"
                        stroke="#0ea5e9"
                        fill="#0ea5e933"
                        strokeWidth={2}
                      />
                    </>
                  )}
                  {pathLens === "blocs" && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="eastAsiaGerdPct"
                        name="East Asia GERD %"
                        stroke="#f43f5e"
                        fill="#f43f5e33"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="northAmericaGerdPct"
                        name="N. America GERD %"
                        stroke="#0ea5e9"
                        fill="#0ea5e933"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <div className="grid gap-6 lg:grid-cols-2">
            <ToggleGroup
              label="Filter"
              value={regionFilter}
              onChange={setRegionFilter}
              options={[
                { id: "all", label: "All regions" },
                { id: "East Asia", label: "East Asia" },
                { id: "North America", label: "N. America" },
                { id: "Europe", label: "Europe" },
                { id: "South Asia", label: "S. Asia" },
              ]}
            />
            <ToggleGroup
              label="Scatter Y"
              value={scatterMetric}
              onChange={setScatterMetric}
              options={[
                { id: "gerd", label: "GERD share" },
                { id: "pubs", label: "Pubs share" },
              ]}
            />
          </div>
          <ChartCard
            title="Intensity × share scatter"
            subtitle="Bubble size ∝ GERD share. Korea intensity tip vs China volume tip."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="intensity"
                    name="R&D intensity %"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "R&D / GDP %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey={
                      scatterMetric === "gerd" ? "gerdShare" : "pubsShare"
                    }
                    name="Share %"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: scatterMetric === "gerd" ? "GERD %" : "Pubs %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}${String(name).includes("intensity") ? "%" : "%"}`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.name ?? ""
                    }
                  />
                  <Scatter data={scatter}>
                    {scatter.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "mismatch" && (
        <>
          <ChartCard
            title="Funding vs output gaps (pp)"
            subtitle="Positive = output share exceeds GERD share. US pubs −17 pp; China CET +46 pp."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gaps} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `${v} pp`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(1)} pp`,
                      item?.payload?.lens ?? "Gap",
                    ]}
                  />
                  <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                    {gaps.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Composed check — Top-1 ladder across perimeters"
            subtitle="Line marks Top-3; bars mark Top-1 tip country share"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={meters}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="top1"
                    name="Top-1 %"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="top3"
                    name="Top-3 %"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
