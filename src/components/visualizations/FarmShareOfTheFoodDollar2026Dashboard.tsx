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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
  CHANNEL_COMPARE,
  HEADLINE,
  INDUSTRY_GROUP_BILL,
  MARKETING_BILL_TREND,
  PRICE_PATH,
  PRIMARY_FACTOR_BILL,
  PRODUCT_FARM_SHARES,
  SOURCE_NOTE,
} from "@/data/farm-share-of-the-food-dollar-2026-data";

type Panel =
  | "marketing-trend"
  | "product-ladder"
  | "industry-bill"
  | "price-wedge"
  | "channel-radar";

type ChannelFocus = "all" | "at-home" | "away";
type ProductFilter = "all" | "minimal" | "moderate" | "heavy";

const COLORS = {
  farm: "#15803d",
  marketing: "#1e3a5f",
  atHome: "#0f766e",
  away: "#b45309",
  labor: "#2563eb",
  property: "#7c3aed",
  accent: "#dc2626",
  muted: "#94a3b8",
  sectors: {
    farm: "#15803d",
    midstream: "#0369a1",
    "retail-service": "#b45309",
    support: "#64748b",
  } as Record<string, string>,
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

export function FarmShareOfTheFoodDollar2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("marketing-trend");
  const [channelFocus, setChannelFocus] = useState<ChannelFocus>("all");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");
  const [showCarried, setShowCarried] = useState(true);

  const trendData = useMemo(() => {
    return MARKETING_BILL_TREND.filter(
      (r) => showCarried || r.confidence === "disclosed",
    ).map((r) => ({
      ...r,
      label: String(r.year),
    }));
  }, [showCarried]);

  const productData = useMemo(() => {
    return PRODUCT_FARM_SHARES.filter((r) => {
      if (r.id === "all-at-home") return productFilter === "all";
      if (productFilter === "all") return true;
      return r.processingIntensity === productFilter;
    }).sort((a, b) => b.farmShareCents - a.farmShareCents);
  }, [productFilter]);

  const industrySorted = useMemo(
    () => [...INDUSTRY_GROUP_BILL].sort((a, b) => b.cents2024 - a.cents2024),
    [],
  );

  const priceScatter = useMemo(
    () =>
      PRICE_PATH.filter((r) => showCarried || r.confidence === "disclosed").map(
        (r) => ({
          year: r.year,
          retail: r.cpiFoodAtHomePct,
          farmEggs: r.farmEggsPpiPct,
          away: r.cpiFoodAwayPct,
          absFarm: Math.abs(r.farmEggsPpiPct),
        }),
      ),
    [showCarried],
  );

  const radarData = useMemo(() => {
    const atHome = CHANNEL_COMPARE[0];
    const away = CHANNEL_COMPARE[1];
    return [
      {
        metric: "Farm share ¢",
        atHome: atHome.farmShare2024,
        away: away.farmShare2024,
      },
      {
        metric: "Marketing ¢",
        atHome: atHome.marketingShare2024 / 5,
        away: away.marketingShare2024 / 5,
      },
      {
        metric: "Labor intensity",
        atHome: atHome.laborIntensityHint,
        away: away.laborIntensityHint,
      },
      {
        metric: "Spending index",
        atHome: (atHome.spending2024Bn / 1270) * 60,
        away: 60,
      },
    ];
  }, []);

  const primary2024 = PRIMARY_FACTOR_BILL.find((r) => r.year === 2024)!;

  return (
    <div
      className="w-full space-y-4"
      data-viz="farm-share-of-the-food-dollar-2026"
    >
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-slate-50 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Headline — USDA ERS Food Dollar (2024 / Mar 2026 model)
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {HEADLINE.farmShareAtHome2024Cents}¢ of every food-at-home dollar
          reaches the farm
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          All-food farm share slipped to{" "}
          <span className="font-semibold text-slate-800">
            {HEADLINE.farmShareAll2024Cents}¢
          </span>{" "}
          (−{Math.abs(ANALYTICS.allFoodFarmDeltaCents).toFixed(1)}¢ YoY) as
          spending tilted toward food away from home (
          {HEADLINE.farmShareAway2024Cents}¢ farm share). Marketing still claims{" "}
          {HEADLINE.marketingShare2024Cents}¢ of the average food dollar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["marketing-trend", "Marketing bill path"],
            ["product-ladder", "Product farm ladder"],
            ["industry-bill", "Industry group bill"],
            ["price-wedge", "CPI vs farm eggs"],
            ["channel-radar", "At-home vs away"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={panel === id}
            onClick={() => setPanel(id)}
          >
            {label}
          </ControlChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Controls
        </span>
        {panel === "marketing-trend" || panel === "channel-radar" ? (
          <>
            <ControlChip
              active={channelFocus === "all"}
              onClick={() => setChannelFocus("all")}
            >
              All food
            </ControlChip>
            <ControlChip
              active={channelFocus === "at-home"}
              onClick={() => setChannelFocus("at-home")}
            >
              At home
            </ControlChip>
            <ControlChip
              active={channelFocus === "away"}
              onClick={() => setChannelFocus("away")}
            >
              Away from home
            </ControlChip>
          </>
        ) : null}
        {panel === "product-ladder" ? (
          <>
            <ControlChip
              active={productFilter === "all"}
              onClick={() => setProductFilter("all")}
            >
              All products
            </ControlChip>
            <ControlChip
              active={productFilter === "minimal"}
              onClick={() => setProductFilter("minimal")}
            >
              Minimal processing
            </ControlChip>
            <ControlChip
              active={productFilter === "moderate"}
              onClick={() => setProductFilter("moderate")}
            >
              Moderate
            </ControlChip>
            <ControlChip
              active={productFilter === "heavy"}
              onClick={() => setProductFilter("heavy")}
            >
              Heavy processing
            </ControlChip>
          </>
        ) : null}
        <ControlChip
          active={showCarried}
          onClick={() => setShowCarried((v) => !v)}
        >
          {showCarried ? "Including carried years" : "Disclosed years only"}
        </ControlChip>
      </div>

      {panel === "marketing-trend" ? (
        <ChartCard
          title="Farm vs marketing share of the food dollar"
          subtitle="Revised Food Dollar model — solid markers are disclosed 2023–2024; earlier years are carried interpolations"
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "¢ per food dollar",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}¢`,
                    String(name),
                  ]}
                />
                <Legend />
                {(channelFocus === "all" || channelFocus === "at-home") && (
                  <Area
                    type="monotone"
                    dataKey="marketingShareCents"
                    name="Marketing share"
                    fill={COLORS.marketing}
                    fillOpacity={0.12}
                    stroke={COLORS.marketing}
                    strokeWidth={2}
                  />
                )}
                {channelFocus === "all" && (
                  <Line
                    type="monotone"
                    dataKey="farmShareCents"
                    name="Farm share (all food)"
                    stroke={COLORS.farm}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                )}
                {(channelFocus === "all" || channelFocus === "at-home") && (
                  <Line
                    type="monotone"
                    dataKey="atHomeFarmCents"
                    name="Farm share (at home)"
                    stroke={COLORS.atHome}
                    strokeWidth={2}
                    strokeDasharray={channelFocus === "all" ? "4 4" : undefined}
                    dot={{ r: 3 }}
                  />
                )}
                {(channelFocus === "all" || channelFocus === "away") && (
                  <Line
                    type="monotone"
                    dataKey="awayFarmCents"
                    name="Farm share (away)"
                    stroke={COLORS.away}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "product-ladder" ? (
        <ChartCard
          title="Food-at-home farm shares by product account"
          subtitle="Fresh eggs return 69.1¢ to the farm; bakery products return 4.8¢ — processing intensity is the wedge"
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 75]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  unit="¢"
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={120}
                  tick={{ fill: "#334155", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}¢`, "Farm share"]}
                />
                <Bar dataKey="farmShareCents" name="Farm share" radius={[0, 4, 4, 0]}>
                  {productData.map((row) => (
                    <Cell
                      key={row.id}
                      fill={
                        row.id === "all-at-home"
                          ? COLORS.accent
                          : row.processingIntensity === "minimal"
                            ? COLORS.farm
                            : row.processingIntensity === "moderate"
                              ? COLORS.atHome
                              : COLORS.marketing
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "industry-bill" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Industry group value-added shares (2024)"
            subtitle="Food services alone take 38.6¢; farm value added is 6.7¢ after purchased inputs"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industrySorted}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={90}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    unit="¢"
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}¢`, "Share"]}
                  />
                  <Bar dataKey="cents2024" name="2024 ¢" radius={[4, 4, 0, 0]}>
                    {industrySorted.map((row) => (
                      <Cell
                        key={row.id}
                        fill={COLORS.sectors[row.sector] ?? COLORS.muted}
                        opacity={row.confidence === "estimated" ? 0.55 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Faded bars are residual estimates that close the dollar after
              disclosed ERS industry groups.
            </p>
          </ChartCard>
          <ChartCard
            title="Primary factor bill (2024)"
            subtitle={`Labor ${primary2024.laborCents}¢ · Property ${primary2024.propertyCents}¢ · Taxes ${primary2024.outputTaxCents}¢`}
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Labor", value: primary2024.laborCents },
                      { name: "Property income", value: primary2024.propertyCents },
                      { name: "Output taxes", value: primary2024.outputTaxCents },
                      {
                        name: "Imported inputs",
                        value: primary2024.importedInputsCents,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}¢`}
                  >
                    {[COLORS.labor, COLORS.property, COLORS.away, COLORS.muted].map(
                      (c, i) => (
                        <Cell key={i} fill={c} />
                      ),
                    )}
                  </Pie>
                  <Tooltip formatter={(v) => `${Number(v).toFixed(1)}¢`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "price-wedge" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Retail CPI vs farm-gate egg PPI"
            subtitle="Egg farm prices swing far harder than grocery CPI — marketing margins damp the pass-through"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={priceScatter}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    label={{
                      value: "CPI %",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    label={{
                      value: "Farm eggs PPI %",
                      angle: 90,
                      position: "insideRight",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="retail"
                    name="CPI food at home %"
                    fill={COLORS.atHome}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="farmEggs"
                    name="Farm eggs PPI %"
                    stroke={COLORS.accent}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Volatility map: retail vs farm eggs"
            subtitle="Bubble size = absolute farm-egg PPI move; x = grocery CPI, y = away-from-home CPI"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="retail"
                    name="At-home CPI %"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    label={{
                      value: "Food-at-home CPI %",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="away"
                    name="Away CPI %"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <ZAxis type="number" dataKey="absFarm" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.year
                        ? `Year ${payload[0].payload.year}`
                        : ""
                    }
                  />
                  <Scatter data={priceScatter} fill={COLORS.farm}>
                    {priceScatter.map((p) => (
                      <Cell
                        key={p.year}
                        fill={p.farmEggs > 0 ? COLORS.accent : COLORS.atHome}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "channel-radar" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Channel structure radar (2024)"
            subtitle="Marketing and labor intensity scaled for shape comparison — farm share shown in raw cents"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#475569", fontSize: 11 }}
                  />
                  <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  {(channelFocus === "all" || channelFocus === "at-home") && (
                    <Radar
                      name="Food at home"
                      dataKey="atHome"
                      stroke={COLORS.atHome}
                      fill={COLORS.atHome}
                      fillOpacity={0.35}
                    />
                  )}
                  {(channelFocus === "all" || channelFocus === "away") && (
                    <Radar
                      name="Food away"
                      dataKey="away"
                      stroke={COLORS.away}
                      fill={COLORS.away}
                      fillOpacity={0.25}
                    />
                  )}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Channel snapshot"
            subtitle="Where the 2023→2024 farm-share delta actually landed"
          >
            <div className="space-y-4 p-2">
              {CHANNEL_COMPARE.map((c) => (
                <div
                  key={c.channel}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{c.channel}</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {c.farmShare2024}¢
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {c.farmShare2023}¢ in 2023 → {c.farmShare2024}¢ in 2024 (
                    {c.farmShare2024 - c.farmShare2023 >= 0 ? "+" : ""}
                    {(c.farmShare2024 - c.farmShare2023).toFixed(1)}¢). Marketing
                    bill {c.marketingShare2024}¢. Spending ≈ $
                    {c.spending2024Bn >= 1000
                      ? `${(c.spending2024Bn / 1000).toFixed(2)}T`
                      : `${c.spending2024Bn}B`}
                    .
                  </p>
                </div>
              ))}
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                Livestock industry value added rose {ANALYTICS.livestockVaPctChange2023to2024}%
                while crops fell {Math.abs(ANALYTICS.cropsVaPctChange2023to2024)}% —
                the farm production mix moved even as the all-food farm share
                edged down.
              </div>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
