"use client";

import { useMemo, useState } from "react";
import {
  Area,
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
  BILLING_GRADE_MIX,
  HEADLINE,
  HOSPITAL_PANEL,
  PEER_COMPARE,
  REGION_SUMMARY,
  SOURCE_NOTE,
  STATE_LADDER,
  SUIT_BAND_MIX,
  VINTAGE_PATH,
  fmtInt,
  fmtMoneyM,
  fmtPct,
  fmtRatio,
  hospitalsByRegion,
  intensityLadder,
  type PeerTier,
  type RegionId,
  type SuitBand,
} from "@/data/hospital-charity-care-versus-collection-suits-2026-data";

// viz-types: intensity ladder bars, charity×suits scatter, vintage
// area+line, suit-band pie + peer bars, region stacks, billing grades
// | layout: default
// smoke-marker: Suits per charity-care dollar

type ViewId =
  | "intensity"
  | "scatter"
  | "vintage"
  | "peers"
  | "regions"
  | "grades";

type RegionFilter = "all" | RegionId;
type PeerFilter = "all" | PeerTier;
type ScatterLens = "suits" | "intensity" | "margin";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";
const EMERALD = "#059669";

const REGION_COLORS: Record<string, string> = {
  South: ROSE,
  Midwest: TEAL,
  West: AMBER,
  Northeast: INDIGO,
};

const BAND_COLORS: Record<SuitBand, string> = {
  none: EMERALD,
  low: SKY,
  moderate: AMBER,
  aggressive: ROSE,
};

const PEER_COLORS: Record<string, string> = {
  Academic: INDIGO,
  Community: TEAL,
  "Safety-net": EMERALD,
  "System flagship": AMBER,
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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function HospitalCharityCareVersusCollectionSuits2026Dashboard() {
  const [view, setView] = useState<ViewId>("intensity");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [peer, setPeer] = useState<PeerFilter>("all");
  const [lens, setLens] = useState<ScatterLens>("suits");

  const filtered = useMemo(() => {
    const byRegion = hospitalsByRegion(region);
    if (peer === "all") return byRegion;
    return byRegion.filter((h) => h.peer === peer);
  }, [region, peer]);

  const ladder = useMemo(() => intensityLadder(filtered, 12), [filtered]);

  const scatterData = useMemo(
    () =>
      filtered.map((h) => ({
        ...h,
        x: h.charityPct,
        y:
          lens === "intensity"
            ? h.suitsPerCharityM
            : lens === "margin"
              ? h.marginPct
              : h.suits,
        z: Math.max(50, Math.min(320, h.charityM * 2.5)),
        fill: REGION_COLORS[h.region] || TEAL,
      })),
    [filtered, lens],
  );

  const yLabel =
    lens === "intensity"
      ? "Suits per $1M charity care"
      : lens === "margin"
        ? "Operating margin (%)"
        : "Patient-debt suits filed";

  const stateRows = useMemo(() => {
    if (region === "all") return STATE_LADDER.slice(0, 14);
    return STATE_LADDER.filter((s) => s.region === region);
  }, [region]);

  const pieData = SUIT_BAND_MIX.map((b) => ({
    name: b.label,
    value: b.hospitals,
    suits: b.suits,
    charity: b.medianCharityPct,
    fill: BAND_COLORS[b.band],
  }));

  return (
    <div
      className="space-y-6"
      data-viz="hospital-charity-care-versus-collection-suits-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
          Suits per charity-care dollar
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {fmtRatio(HEADLINE.medianSuitsPerCharityM)} suits / $1M
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Median patient-debt suits per $1M of Schedule H charity care among
          suing hospitals in a {HEADLINE.panelN}-hospital desk panel — about{" "}
          {HEADLINE.intensityMultiple}× the intensity of non-suing peers (
          {fmtRatio(HEADLINE.peerMedianSuitsPerCharityM)}). Aggressive
          litigators (100+ suits) post a median charity-care share of{" "}
          {fmtPct(HEADLINE.aggressiveCharityPct)} of expenses versus{" "}
          {fmtPct(HEADLINE.nonsuingCharityPct)} for non-suing peers.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-slate-400">Panel suits</span>{" "}
            <span className="font-semibold">{fmtInt(HEADLINE.panelSuits)}</span>
          </div>
          <div>
            <span className="text-slate-400">Charity care</span>{" "}
            <span className="font-semibold">
              {fmtMoneyM(HEADLINE.panelCharityM, 0)}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Low-charity suit share</span>{" "}
            <span className="font-semibold">
              {fmtPct(HEADLINE.suitShareLowCharityPct, 0)}
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Panels: Charity-care share vs collection intensity · Peer-tier
          medians · regional and billing-grade views.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          options={[
            { id: "intensity", label: "Intensity ladder" },
            { id: "scatter", label: "Charity × suits" },
            { id: "vintage", label: "Vintage path" },
            { id: "peers", label: "Peers & bands" },
            { id: "regions", label: "Regions & states" },
            { id: "grades", label: "Billing grades" },
          ]}
          value={view}
          onChange={setView}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup<RegionFilter>
            options={[
              { id: "all", label: "All regions" },
              { id: "South", label: "South" },
              { id: "Midwest", label: "Midwest" },
              { id: "Northeast", label: "Northeast" },
              { id: "West", label: "West" },
            ]}
            value={region}
            onChange={setRegion}
          />
          <ToggleGroup<PeerFilter>
            options={[
              { id: "all", label: "All peers" },
              { id: "Community", label: "Community" },
              { id: "Academic", label: "Academic" },
              { id: "System flagship", label: "System" },
              { id: "Safety-net", label: "Safety-net" },
            ]}
            value={peer}
            onChange={setPeer}
          />
        </div>
      </div>

      {view === "intensity" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Suits per $1M charity care"
            subtitle="Highest-intensity hospitals in the filtered panel"
          >
            <div className="h-[420px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladder}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={128}
                    tick={{ fill: NAVY, fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${fmtRatio(Number(v))} suits / $1M`,
                      "Intensity",
                    ]}
                  />
                  <Bar dataKey="suitsPerCharityM" radius={[0, 4, 4, 0]}>
                    {ladder.map((h) => (
                      <Cell
                        key={h.id}
                        fill={BAND_COLORS[h.suitBand] || ROSE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Raw suit counts"
            subtitle="Same hospitals — absolute docket volume"
          >
            <div className="h-[420px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladder}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={128}
                    tick={{ fill: NAVY, fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtInt(Number(v)), "Suits"]}
                  />
                  <Bar dataKey="suits" fill={NAVY} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Charity-care share vs collection intensity"
          subtitle="Bubble size ≈ charity-care dollars; color = census region"
        >
          <div className="mb-3">
            <ToggleGroup<ScatterLens>
              options={[
                { id: "suits", label: "Y: suit count" },
                { id: "intensity", label: "Y: suits / $1M" },
                { id: "margin", label: "Y: margin %" },
              ]}
              value={lens}
              onChange={setLens}
            />
          </div>
          <div className="h-[440px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Charity %"
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Charity care % of expenses",
                    position: "insideBottom",
                    offset: -4,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={yLabel}
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 320]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    if (name === "x") return [fmtPct(Number(v)), "Charity %"];
                    if (lens === "margin")
                      return [fmtPct(Number(v)), "Margin"];
                    if (lens === "intensity")
                      return [`${fmtRatio(Number(v))}`, "Suits/$1M"];
                    return [fmtInt(Number(v)), "Suits"];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    return p?.name ?? "";
                  }}
                />
                <Scatter data={scatterData} name="Hospitals">
                  {scatterData.map((h) => (
                    <Cell key={h.id} fill={h.fill} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Filtered hospitals: {filtered.length} of {HOSPITAL_PANEL.length}.
            Aggressive litigators cluster toward the low-charity, high-suit
            quadrant.
          </p>
        </ChartCard>
      )}

      {view === "vintage" && (
        <ChartCard
          title="Suits vs charity-care dollars over time"
          subtitle="Desk path for tracked litigating systems (nominal charity $M)"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={VINTAGE_PATH}
                margin={{ top: 12, right: 20, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Suits / charity $M",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="charityM"
                  name="Charity care $M"
                  fill={TEAL}
                  fillOpacity={0.2}
                  stroke={TEAL}
                />
                <Bar
                  yAxisId="right"
                  dataKey="suits"
                  name="Suits filed"
                  fill={NAVY}
                  opacity={0.35}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="suitsPerCharityM"
                  name="Suits per $1M charity"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2020 dip reflects pandemic court closures and temporary billing
            pauses; intensity rebounded as dockets reopened while charity-care
            shares among aggressive litigators stayed thin.
          </p>
        </ChartCard>
      )}

      {view === "peers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Suit-band mix"
            subtitle="Hospital count by annual docket intensity"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const p = item?.payload;
                      return [
                        `${fmtInt(Number(v))} hospitals · median charity ${fmtPct(p?.charity ?? 0)}`,
                        p?.name ?? "Band",
                      ];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Peer-tier medians"
            subtitle="Charity-care share and suit intensity by hospital type"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PEER_COMPARE}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="peer"
                    tick={{ fill: SLATE, fontSize: 10 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="medianCharityPct"
                    name="Median charity %"
                    radius={[4, 4, 0, 0]}
                  >
                    {PEER_COMPARE.map((p) => (
                      <Cell
                        key={p.peer}
                        fill={PEER_COLORS[p.peer] || TEAL}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="medianSuitsPerCharityM"
                    name="Median suits/$1M"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional intensity"
            subtitle="Suits per $1M charity care by census region"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGION_SUMMARY}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="suitsPerCharityM"
                    name="Suits / $1M charity"
                    radius={[4, 4, 0, 0]}
                  >
                    {REGION_SUMMARY.map((r) => (
                      <Cell
                        key={r.region}
                        fill={REGION_COLORS[r.region] || TEAL}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="medianCharityPct"
                    name="Median charity %"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="State intensity ladder"
            subtitle="Panel states ranked by suits per $1M charity care"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateRows}
                  layout="vertical"
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="abbr"
                    width={36}
                    tick={{ fill: NAVY, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${fmtRatio(Number(v))} suits / $1M`,
                      "Intensity",
                    ]}
                  />
                  <Bar dataKey="suitsPerCharityM" radius={[0, 4, 4, 0]}>
                    {stateRows.map((s) => (
                      <Cell
                        key={s.abbr}
                        fill={REGION_COLORS[s.region] || TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "grades" && (
        <ChartCard
          title="Lown-style billing grade vs suit intensity"
          subtitle="Median suits per $1M charity care by billing-ethics grade proxy"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={BILLING_GRADE_MIX.filter((g) => g.hospitals > 0)}
                margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="grade" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="medianSuitsPerCharityM"
                  name="Median suits / $1M"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="medianCharityPct"
                  name="Median charity %"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Grades are desk proxies aligned to Lown Hospitals Index billing /
            social-responsibility bands for the panel — not official Lown
            letter grades for every facility.
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
