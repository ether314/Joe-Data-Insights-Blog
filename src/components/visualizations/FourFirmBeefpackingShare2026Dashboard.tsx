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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  HEADLINE,
  NATIONAL_CR4,
  PACKER_MARGINS,
  PLANT_TIERS,
  PROCUREMENT_MIX,
  REGION_SCATTER,
  REGIONAL_MARKETS,
  SOURCE_NOTE,
} from "@/data/four-firm-beefpacking-share-2026-data";

type Panel =
  | "cr4-path"
  | "regional-hhi"
  | "procurement-mix"
  | "packer-margins"
  | "plants-scatter";

type RegionLens = "all" | "plains" | "midwest";
type MarginLens = "annual" | "all";

const COLORS = {
  fed: "#b45309",
  cow: "#64748b",
  hhi: "#1e3a5f",
  cash: "#0f766e",
  formula: "#7c3aed",
  other: "#94a3b8",
  marginPos: "#15803d",
  marginNeg: "#dc2626",
  mega: "#0369a1",
  mid: "#ca8a04",
  small: "#94a3b8",
  accent: "#ea580c",
};

const PLAINS_IDS = new Set(["tx-ok-nm", "ks", "ne", "co"]);
const MIDWEST_IDS = new Set(["ia-mn", "ne"]);

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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
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
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function FourFirmBeefpackingShare2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("regional-hhi");
  const [regionLens, setRegionLens] = useState<RegionLens>("all");
  const [marginLens, setMarginLens] = useState<MarginLens>("all");
  const [showCarried, setShowCarried] = useState(true);

  const cr4Data = useMemo(() => {
    return NATIONAL_CR4.filter(
      (r) => showCarried || r.confidence === "disclosed",
    ).map((r) => ({
      year: r.year,
      fedCr4: r.steersHeifersCr4Pct,
      cowCr4: r.cowBullCr4Pct,
    }));
  }, [showCarried]);

  const regionalData = useMemo(() => {
    return REGIONAL_MARKETS.filter((r) => {
      if (r.regionId === "national") return regionLens === "all";
      if (regionLens === "plains") return PLAINS_IDS.has(r.regionId);
      if (regionLens === "midwest") return MIDWEST_IDS.has(r.regionId);
      return true;
    }).map((r) => ({
      region: r.region,
      hhi: r.hhi2021,
      cash: r.cashNegotiatedSharePct,
    }));
  }, [regionLens]);

  const scatterData = useMemo(() => {
    return REGION_SCATTER.filter((r) => {
      const id = REGIONAL_MARKETS.find((m) => m.region === r.region)?.regionId;
      if (!id) return false;
      if (regionLens === "plains") return PLAINS_IDS.has(id);
      if (regionLens === "midwest") return MIDWEST_IDS.has(id);
      return true;
    });
  }, [regionLens]);

  const marginData = useMemo(() => {
    return PACKER_MARGINS.filter(
      (r) => marginLens === "all" || r.kind === "annual",
    ).map((r) => ({
      period: r.period,
      margin: r.packerMarginPerHead,
      fill: r.packerMarginPerHead >= 0 ? COLORS.marginPos : COLORS.marginNeg,
    }));
  }, [marginLens]);

  const plantPie = PLANT_TIERS.map((t) => ({
    name: t.tier,
    value: t.shareOfTotalSlaughterPct,
  }));

  const plantColors = [COLORS.small, COLORS.mid, COLORS.mega];

  return (
    <div
      className="space-y-4"
      data-viz="four-firm-beefpacking-share-2026"
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-900">
          Regional four-firm share
        </p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          Headline — fed CR4 {HEADLINE.nationalCr4Pct}% nationally · TX–OK–NM
          HHI &gt;{HEADLINE.peakRegionalHhi2021.toLocaleString()} · packer
          margins −${Math.abs(HEADLINE.packerMargin2025PerHead)}/head in 2025
        </p>
        <p className="mt-2 text-sm text-slate-600">
          National concentration looks stable near {HEADLINE.nationalCr4Pct}%
          of fed slaughter. Regional procurement markets are far tighter — and
          packer margins flipped negative as the herd contraction pinched fed
          supplies after {HEADLINE.marginsNegativeSince}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <ControlChip
          active={panel === "regional-hhi"}
          onClick={() => setPanel("regional-hhi")}
        >
          Regional HHI vs cash
        </ControlChip>
        <ControlChip
          active={panel === "cr4-path"}
          onClick={() => setPanel("cr4-path")}
        >
          National CR4 path
        </ControlChip>
        <ControlChip
          active={panel === "procurement-mix"}
          onClick={() => setPanel("procurement-mix")}
        >
          Procurement mix
        </ControlChip>
        <ControlChip
          active={panel === "packer-margins"}
          onClick={() => setPanel("packer-margins")}
        >
          Packer margins
        </ControlChip>
        <ControlChip
          active={panel === "plants-scatter"}
          onClick={() => setPanel("plants-scatter")}
        >
          Plants + cash–HHI scatter
        </ControlChip>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs font-medium uppercase text-slate-500">
          Region lens
        </span>
        <ControlChip
          active={regionLens === "all"}
          onClick={() => setRegionLens("all")}
        >
          All regions
        </ControlChip>
        <ControlChip
          active={regionLens === "plains"}
          onClick={() => setRegionLens("plains")}
        >
          Southern / Central Plains
        </ControlChip>
        <ControlChip
          active={regionLens === "midwest"}
          onClick={() => setRegionLens("midwest")}
        >
          Midwest contrast
        </ControlChip>
        {(panel === "cr4-path" || panel === "procurement-mix") && (
          <>
            <span className="self-center text-xs font-medium uppercase text-slate-500">
              History
            </span>
            <ControlChip
              active={showCarried}
              onClick={() => setShowCarried(true)}
            >
              Including carried years
            </ControlChip>
            <ControlChip
              active={!showCarried}
              onClick={() => setShowCarried(false)}
            >
              Disclosed only
            </ControlChip>
          </>
        )}
        {panel === "packer-margins" && (
          <>
            <span className="self-center text-xs font-medium uppercase text-slate-500">
              Margin view
            </span>
            <ControlChip
              active={marginLens === "all"}
              onClick={() => setMarginLens("all")}
            >
              Annual + weekly
            </ControlChip>
            <ControlChip
              active={marginLens === "annual"}
              onClick={() => setMarginLens("annual")}
            >
              Annual only
            </ControlChip>
          </>
        )}
      </div>

      {panel === "regional-hhi" && (
        <ChartCard
          title="Regional procurement HHI vs cash negotiated share"
          subtitle={`DOJ/FTC highly-concentrated line ≈ ${ANALYTICS.doJHighlyConcentratedLine}. National HHI ${HEADLINE.nationalHhi2021} sits below it; several LMR regions do not.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={regionalData}
                margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="hhi"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "HHI",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="cash"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  label={{
                    value: "Cash %",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="hhi"
                  dataKey="hhi"
                  name="Procurement HHI (2021)"
                  fill={COLORS.hhi}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="cash"
                  type="monotone"
                  dataKey="cash"
                  name="Cash negotiated %"
                  stroke={COLORS.cash}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cr4-path" && (
        <ChartCard
          title="National four-firm share — fed cattle vs cows & bulls"
          subtitle={`Steers & heifers rose from ${HEADLINE.cr4Year1980Pct}% (1980) to ${HEADLINE.cr4Mid1990sPct}% (1995) and have plateaued near ${HEADLINE.nationalCr4Pct}%. Cow/bull slaughter stays far less concentrated.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cr4Data}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="fedCr4"
                  name="Steers & heifers CR4"
                  fill={COLORS.fed}
                  fillOpacity={0.25}
                  stroke={COLORS.fed}
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="cowCr4"
                  name="Cows & bulls CR4"
                  stroke={COLORS.cow}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "procurement-mix" && (
        <ChartCard
          title="How packers buy fed cattle — cash vs formula"
          subtitle="Formulas became the dominant AMA path after ~2010. Thin residual cash markets still set many formula base prices."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={PROCUREMENT_MIX.filter(
                  (r) => showCarried || r.confidence === "disclosed",
                )}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cashNegotiatedPct"
                  name="Cash negotiated"
                  stackId="1"
                  fill={COLORS.cash}
                  stroke={COLORS.cash}
                />
                <Area
                  type="monotone"
                  dataKey="formulaPct"
                  name="Formula AMA"
                  stackId="1"
                  fill={COLORS.formula}
                  stroke={COLORS.formula}
                />
                <Area
                  type="monotone"
                  dataKey="otherPct"
                  name="Other / forward"
                  stackId="1"
                  fill={COLORS.other}
                  stroke={COLORS.other}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "packer-margins" && (
        <ChartCard
          title="Packer margins through the herd contraction"
          subtitle={`Swing of ${ANALYTICS.marginSwing2023To2025} $/head from 2023 annual to 2025 annual (Sterling Beef Profit Tracker). Negative since ${HEADLINE.marginsNegativeSince}.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marginData}
                margin={{ top: 8, right: 12, left: 0, bottom: 32 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "$ / head",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Bar dataKey="margin" name="Packer margin ($/head)" radius={[4, 4, 0, 0]}>
                  {marginData.map((row) => (
                    <Cell key={row.period} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "plants-scatter" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Slaughter share by plant capacity tier"
            subtitle={`${ANALYTICS.megaPlantCount} plants ≥1M head/yr accounted for ${ANALYTICS.megaPlantFedSharePct}% of fed slaughter (2025).`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plantPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {plantPie.map((_, i) => (
                      <Cell
                        key={plantPie[i].name}
                        fill={plantColors[i % plantColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Cash share vs regional HHI"
            subtitle="Higher HHI regions tend to run thinner cash negotiated shares — residual discovery on a concentrated buyer map."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="hhi"
                    name="HHI"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Regional HHI",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="cashPct"
                    name="Cash %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis range={[80, 200]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { region?: string } | undefined)
                        ?.region ?? ""
                    }
                  />
                  <Scatter
                    name="LMR regions"
                    data={scatterData}
                    fill={COLORS.accent}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
