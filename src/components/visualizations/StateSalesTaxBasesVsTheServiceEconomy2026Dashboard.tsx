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
  CATEGORY_COVERAGE,
  FTA_CATEGORY_MAX,
  FTA_SURVEY_TOTAL_SERVICES,
  GST_STATES,
  HEADLINE,
  PCE_MIX_TREND,
  SOURCE_NOTE,
  STATE_ROWS,
  exposureScore,
  serviceCoveragePct,
  type Region,
  type StateSalesTaxRow,
} from "@/data/state-sales-tax-bases-vs-the-service-economy-2026-data";

type Panel =
  | "exposure-scatter"
  | "outside-ladder"
  | "pce-mix"
  | "category-radar"
  | "reliance-bars";

type RegionFilter = "all" | Region;
type BandFilter = "all" | "broad" | "mid" | "narrow";

const COLORS = {
  broad: "#0f766e",
  mid: "#0369a1",
  narrow: "#b45309",
  goods: "#1e3a5f",
  services: "#c2410c",
  accent: "#dc2626",
  muted: "#94a3b8",
  ink: "#0f172a",
};

function bandColor(band: StateSalesTaxRow["baseBand"]): string {
  if (band === "broad") return COLORS.broad;
  if (band === "mid") return COLORS.mid;
  if (band === "narrow") return COLORS.narrow;
  return COLORS.muted;
}

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

const PANELS: { id: Panel; label: string }[] = [
  { id: "exposure-scatter", label: "Reliance vs services" },
  { id: "outside-ladder", label: "Outside-base ladder" },
  { id: "pce-mix", label: "PCE goods vs services" },
  { id: "category-radar", label: "Service categories" },
  { id: "reliance-bars", label: "Exposure scoreboard" },
];

const REGIONS: RegionFilter[] = [
  "all",
  "Northeast",
  "Midwest",
  "South",
  "Mountain",
  "Pacific",
];

export function StateSalesTaxBasesVsTheServiceEconomy2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("exposure-scatter");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [band, setBand] = useState<BandFilter>("all");
  const [focusAbbr, setFocusAbbr] = useState("FL");
  const [ladderMetric, setLadderMetric] = useState<"outside" | "taxable" | "services">(
    "outside",
  );

  const filtered = useMemo(() => {
    return GST_STATES.filter((r) => {
      if (region !== "all" && r.region !== region) return false;
      if (band !== "all" && r.baseBand !== band) return false;
      return true;
    });
  }, [region, band]);

  const scatterData = useMemo(
    () =>
      filtered
        .filter((r) => r.salesTaxShareOfCollectionsPct != null)
        .map((r) => ({
          abbr: r.abbr,
          state: r.state,
          x: r.servicesTaxed,
          y: r.salesTaxShareOfCollectionsPct!,
          z: r.outsideShareOfPcePct ?? 50,
          band: r.baseBand,
          outside: r.outsideShareOfPcePct,
          exposure: exposureScore(r),
        })),
    [filtered],
  );

  const ladderData = useMemo(() => {
    const rows = [...filtered].filter((r) => r.outsideShareOfPcePct != null);
    rows.sort((a, b) => {
      if (ladderMetric === "outside")
        return (b.outsideShareOfPcePct ?? 0) - (a.outsideShareOfPcePct ?? 0);
      if (ladderMetric === "taxable")
        return (b.taxableShareOfPcePct ?? 0) - (a.taxableShareOfPcePct ?? 0);
      return b.servicesTaxed - a.servicesTaxed;
    });
    return rows.slice(0, 18).map((r) => ({
      abbr: r.abbr,
      state: r.state,
      value:
        ladderMetric === "outside"
          ? r.outsideShareOfPcePct!
          : ladderMetric === "taxable"
            ? r.taxableShareOfPcePct!
            : r.servicesTaxed,
      fill: bandColor(r.baseBand),
    }));
  }, [filtered, ladderMetric]);

  const focusRow =
    STATE_ROWS.find((r) => r.abbr === focusAbbr) ??
    STATE_ROWS.find((r) => r.abbr === "FL")!;

  const radarData = useMemo(() => {
    const keys = Object.keys(FTA_CATEGORY_MAX) as (keyof typeof FTA_CATEGORY_MAX)[];
    return keys.map((key) => {
      const max = FTA_CATEGORY_MAX[key];
      const raw = focusRow[key] as number;
      return {
        category: CATEGORY_COVERAGE.find((c) => c.key === key)?.category ?? key,
        pct: Math.round((100 * raw) / max),
        surveyed: max,
        taxed: raw,
      };
    });
  }, [focusRow]);

  const exposureBoard = useMemo(() => {
    return [...filtered]
      .map((r) => ({
        abbr: r.abbr,
        state: r.state,
        exposure: exposureScore(r) ?? 0,
        services: r.servicesTaxed,
        reliance: r.salesTaxShareOfCollectionsPct ?? 0,
        fill: bandColor(r.baseBand),
      }))
      .filter((r) => r.exposure > 0)
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 15);
  }, [filtered]);

  const focusOptions = useMemo(
    () =>
      [...GST_STATES].sort((a, b) => a.state.localeCompare(b.state)),
    [],
  );

  return (
    <div
      className="space-y-4"
      data-viz="state-sales-tax-bases-vs-the-service-economy-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Headline — Taxable share of consumption
        </p>
        <p className="mt-1 text-lg font-bold leading-snug sm:text-xl">
          Median GST state taxes {HEADLINE.medianServicesTaxedGst} of{" "}
          {FTA_SURVEY_TOTAL_SERVICES} FTA services while services are{" "}
          {HEADLINE.servicesShareOfPcePct}% of PCE — desk median taxable share ≈{" "}
          {HEADLINE.medianTaxableShareOfPcePct}%
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Florida leans on sales tax for {HEADLINE.topRelianceSalesSharePct}% of
          collections (Pew FY2023) but taxes only {HEADLINE.topRelianceServicesTaxed}{" "}
          surveyed services. {ANALYTICS.narrowCount} GST states sit in the narrow
          FTA band (≤40 services).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PANELS.map((p) => (
          <ControlChip
            key={p.id}
            active={panel === p.id}
            onClick={() => setPanel(p.id)}
          >
            {p.label}
          </ControlChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Region
        </span>
        {REGIONS.map((r) => (
          <ControlChip
            key={r}
            active={region === r}
            onClick={() => setRegion(r)}
          >
            {r === "all" ? "All regions" : r}
          </ControlChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Base band
        </span>
        {(
          [
            ["all", "All bands"],
            ["broad", "Broad"],
            ["mid", "Mid"],
            ["narrow", "Narrow"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={band === id}
            onClick={() => setBand(id)}
          >
            {label}
          </ControlChip>
        ))}
      </div>

      {panel === "exposure-scatter" ? (
        <ChartCard
          title="Sales-tax reliance vs FTA services taxed"
          subtitle="Bubble size ≈ desk outside-base share of PCE. Teal = broad, blue = mid, amber = narrow."
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Services taxed"
                  domain={[0, 180]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "FTA services taxed (of 176)",
                    position: "insideBottom",
                    offset: -16,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Sales share"
                  domain={[0, 70]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Sales tax % of state collections",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    const d = payload?.[0]?.payload;
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.state}</p>
                        <p>{d.x} services taxed</p>
                        <p>{d.y}% sales-tax reliance</p>
                        <p>~{d.outside}% of PCE outside desk base</p>
                        <p>Exposure {d.exposure}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="GST states">
                  {scatterData.map((d) => (
                    <Cell key={d.abbr} fill={bandColor(d.band)} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "outside-ladder" ? (
        <ChartCard
          title="Household spending outside the taxable base"
          subtitle="Desk taxable-share join of BEA PCE mix × FTA coverage × food flags. Sort with the metric chips."
        >
          <div className="mb-3 flex flex-wrap gap-2">
            <ControlChip
              active={ladderMetric === "outside"}
              onClick={() => setLadderMetric("outside")}
            >
              Outside share %
            </ControlChip>
            <ControlChip
              active={ladderMetric === "taxable"}
              onClick={() => setLadderMetric("taxable")}
            >
              Taxable share %
            </ControlChip>
            <ControlChip
              active={ladderMetric === "services"}
              onClick={() => setLadderMetric("services")}
            >
              Services taxed
            </ControlChip>
          </div>
          <div className="h-[480px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ladderData}
                margin={{ top: 4, right: 24, bottom: 4, left: 36 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={({ payload }) => {
                    const d = payload?.[0]?.payload;
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.state}</p>
                        <p>
                          {ladderMetric === "services"
                            ? `${d.value} services`
                            : `${d.value}%`}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.abbr} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "pce-mix" ? (
        <ChartCard
          title="National PCE: goods retreat, services rise"
          subtitle="BEA personal consumption expenditure shares. The sales-tax statute mostly still tracks the shrinking goods column."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={PCE_MIX_TREND}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[25, 75]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v, name) => [
                    `${Number(v)}%`,
                    name === "goodsSharePct" ? "Goods" : "Services",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="servicesSharePct"
                  name="Services"
                  fill={COLORS.services}
                  stroke={COLORS.services}
                  fillOpacity={0.25}
                />
                <Line
                  type="monotone"
                  dataKey="goodsSharePct"
                  name="Goods"
                  stroke={COLORS.goods}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "category-radar" ? (
        <ChartCard
          title={`Service-category coverage — ${focusRow.state}`}
          subtitle={`% of FTA surveyed items taxed in each category (${focusRow.servicesTaxed} / ${FTA_SURVEY_TOTAL_SERVICES} total). Professional and personal services remain the thin rings in most states.`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Focus state
            </label>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
              value={focusAbbr}
              onChange={(e) => setFocusAbbr(e.target.value)}
            >
              {focusOptions.map((r) => (
                <option key={r.abbr} value={r.abbr}>
                  {r.state} ({r.servicesTaxed})
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-500">
              Coverage {serviceCoveragePct(focusRow).toFixed(0)}% · band{" "}
              {focusRow.baseBand}
            </span>
          </div>
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="% of category taxed"
                  dataKey="pct"
                  stroke={COLORS.broad}
                  fill={COLORS.broad}
                  fillOpacity={0.45}
                />
                <Tooltip
                  formatter={(v, _n, ctx) => {
                    const p = ctx?.payload as
                      | { taxed?: number; surveyed?: number }
                      | undefined;
                    return [
                      `${Number(v)}% (${p?.taxed ?? "?"}/${p?.surveyed ?? "?"})`,
                      "Taxed",
                    ];
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {CATEGORY_COVERAGE.slice(0, 3).map((c) => (
              <div
                key={c.key}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
              >
                <span className="font-semibold text-slate-800">{c.category}:</span>{" "}
                {c.statesTaxingMajority} states tax &gt;½ of surveyed items
              </div>
            ))}
          </div>
        </ChartCard>
      ) : null}

      {panel === "reliance-bars" ? (
        <ChartCard
          title="Base-erosion exposure scoreboard"
          subtitle="Score = sales-tax share of collections × (1 − FTA services coverage). High = revenue-hungry on a thin service base."
        >
          <div className="h-[460px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={exposureBoard}
                margin={{ top: 8, right: 12, bottom: 48, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="abbr"
                  tick={{ fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={56}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ payload }) => {
                    const d = payload?.[0]?.payload;
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.state}</p>
                        <p>Exposure {d.exposure}</p>
                        <p>
                          {d.services} services · {d.reliance}% sales reliance
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="exposure" radius={[4, 4, 0, 0]}>
                  {exposureBoard.map((d) => (
                    <Cell key={d.abbr} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
