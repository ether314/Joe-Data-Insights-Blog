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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ABATEMENT_SCHEDULE,
  CALGARY_YIELD,
  CITY_PROGRAMS,
  CONVERSION_VS_GROUNDUP,
  COST_UNIT_SCATTER,
  DC_FIRST_AWARDS_TOTAL,
  HEADLINE,
  NYC_GEO_SPLIT,
  SOURCE_NOTE,
  formatUsdCompact,
  type CostMetric,
} from "@/data/subsidy-cost-per-converted-apartment-2026-data";

type Panel = "ladder" | "scatter" | "versus" | "nycSplit" | "schedule";
type PathwayFilter = "all" | "conversion" | "groundUp";
type CityFilter = "all" | "nyc" | "dc" | "calgary";

const COLORS = {
  abatement: "#0f4c81",
  grant: "#0f766e",
  framing: "#b45309",
  ground: "#64748b",
  opp: "#9f1239",
  tax: "#1d4ed8",
  muted: "#94a3b8",
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

function instrumentColor(instrument: string): string {
  if (instrument.includes("grant") || instrument === "Cash grant") return COLORS.grant;
  if (instrument.includes("framing") || instrument === "Program framing") return COLORS.framing;
  if (instrument.includes("ground") || instrument.includes("Tax abatement")) return COLORS.abatement;
  return COLORS.abatement;
}

export function SubsidyCostPerConvertedApartment2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("ladder");
  const [metric, setMetric] = useState<CostMetric>("perDeliveredUnit");
  const [pathway, setPathway] = useState<PathwayFilter>("all");
  const [city, setCity] = useState<CityFilter>("all");

  const ladderData = useMemo(() => {
    return CITY_PROGRAMS.filter((r) => {
      if (city === "nyc" && r.id !== "nyc") return false;
      if (city === "dc" && r.id !== "dc") return false;
      if (city === "calgary" && !r.id.startsWith("calgary")) return false;
      return true;
    }).map((r) => {
      let value = r.costPerDeliveredUnitUsd;
      if (metric === "perIncomeRestricted") {
        value = r.costPerIncomeRestrictedUsd ?? 0;
      }
      if (metric === "perBedroomProxy") {
        value =
          r.id === "nyc"
            ? 1_700_000
            : r.costPerIncomeRestrictedUsd ?? r.costPerDeliveredUnitUsd;
      }
      return {
        label: `${r.city}: ${r.program.split("(")[0].trim()}`,
        value,
        short: r.city,
        instrument: r.instrument,
        missing: metric !== "perDeliveredUnit" && r.costPerIncomeRestrictedUsd == null && r.id !== "nyc",
      };
    }).filter((d) => !d.missing && d.value > 0);
  }, [metric, city]);

  const scatterData = useMemo(() => {
    return COST_UNIT_SCATTER.filter((p) => {
      if (city === "all") return true;
      if (city === "calgary") return p.id.startsWith("calgary");
      return p.id === city;
    });
  }, [city]);

  const versusData = useMemo(() => {
    return CONVERSION_VS_GROUNDUP.filter((r) => {
      if (pathway === "all") return true;
      return r.pathway === pathway;
    }).map((r) => ({
      label: r.label.replace("NYC ", "").replace(" / ", "/"),
      publicCostUsd: r.publicCostUsd,
      pathway: r.pathway,
      fill: r.pathway === "conversion" ? COLORS.abatement : COLORS.ground,
    }));
  }, [pathway]);

  const nycSplitData = useMemo(
    () =>
      NYC_GEO_SPLIT.map((z) => ({
        zone: z.zone.replace("Rest of Manhattan S of 59th", "Rest of MN S59"),
        taxExp: z.taxExpenditurePvM,
        oppCost: z.opportunityCostPvM,
        perIr: z.oppCostPerIrUnitM,
      })),
    [],
  );

  const scheduleData = useMemo(
    () =>
      ABATEMENT_SCHEDULE.map((r) => ({
        year: r.year,
        nyc: r.nycExemptPct,
        dc: r.dcActive * 100,
        calgary: r.calgaryGrantPct,
      })),
    [],
  );

  return (
    <div
      className="w-full space-y-4"
      data-viz="subsidy-cost-per-converted-apartment-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Public $ per converted unit
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {formatUsdCompact(HEADLINE.nycTaxExpenditurePerUnitUsd)} NYC tax expenditure
          <span className="text-teal-200"> · </span>
          {formatUsdCompact(HEADLINE.calgaryGrantPerHomeUsd)} Calgary grant
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Comptroller PV on ~{HEADLINE.nycPipelineUnits.toLocaleString()} Manhattan units
          vs cash grant on completed Calgary homes — {HEADLINE.nycVsCalgaryPerUnitRatio}×
          gap on a per-delivered-unit basis. DC frames ~{formatUsdCompact(HEADLINE.dcFramedPerProjectedUnitUsd)}{" "}
          per projected unit under a $41M annual-authority cap. Abatement vs grant instrument ladder.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["ladder", "Cost ladder"],
            ["scatter", "Cost × scale"],
            ["versus", "Conversion vs ground-up"],
            ["nycSplit", "NYC geo split"],
            ["schedule", "Instrument schedule"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Cost metric
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-900"
            value={metric}
            onChange={(e) => setMetric(e.target.value as CostMetric)}
          >
            <option value="perDeliveredUnit">Per delivered unit</option>
            <option value="perIncomeRestricted">Per income-restricted unit</option>
            <option value="perBedroomProxy">Per IR bedroom (NYC)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pathway
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-900"
            value={pathway}
            onChange={(e) => setPathway(e.target.value as PathwayFilter)}
          >
            <option value="all">All pathways</option>
            <option value="conversion">Conversion only</option>
            <option value="groundUp">Ground-up only</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          City focus
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-900"
            value={city}
            onChange={(e) => setCity(e.target.value as CityFilter)}
          >
            <option value="all">All cities</option>
            <option value="nyc">New York</option>
            <option value="dc">Washington, DC</option>
            <option value="calgary">Calgary</option>
          </select>
        </label>
        <div className="ml-auto grid grid-cols-3 gap-3 text-center text-xs sm:text-sm">
          <div>
            <p className="font-bold text-slate-900">{formatUsdCompact(HEADLINE.nycOppCostPerIncomeRestrictedUsd)}</p>
            <p className="text-slate-500">NYC / IR unit</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">{DC_FIRST_AWARDS_TOTAL.units}</p>
            <p className="text-slate-500">DC first awards</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">{CALGARY_YIELD.sfPerHome.toLocaleString()} sf</p>
            <p className="text-slate-500">Calgary SF/home</p>
          </div>
        </div>
      </div>

      {panel === "ladder" ? (
        <ChartCard
          title="Public cost per unit by city program"
          subtitle="Tax-abatement present value, cash grant, and program framing are not identical instruments — compare labels, not just bar height."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ladderData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatUsdCompact(Number(v))}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={150}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(v) => formatUsdCompact(Number(v ?? 0))}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value" name="Public $" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.label} fill={instrumentColor(d.instrument)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Public $ per unit versus pipeline scale"
          subtitle="Bubble size tracks unit count. DC’s low framed cost sits far left; NYC’s PV abatement sits high and large."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="publicCostPerUnitUsd"
                  name="Public $/unit"
                  tickFormatter={(v) => formatUsdCompact(Number(v))}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="units"
                  name="Units"
                  tick={{ fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="units" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) =>
                    String(name).includes("Public") || String(name) === "publicCostPerUnitUsd"
                      ? formatUsdCompact(Number(v ?? 0))
                      : Number(v ?? 0).toLocaleString()
                  }
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { city?: string } | undefined)?.city ?? ""
                  }
                />
                <Scatter data={scatterData} fill={COLORS.abatement}>
                  {scatterData.map((p) => (
                    <Cell key={p.id} fill={instrumentColor(p.instrument)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "versus" ? (
        <ChartCard
          title="Conversion public cost vs ground-up benchmarks"
          subtitle="Apples are imperfect: abatement PV ≠ LIHTC equity ≠ city capital write-down. Use as order-of-magnitude."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={versusData} margin={{ bottom: 64, left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  tickFormatter={(v) => formatUsdCompact(Number(v))}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => formatUsdCompact(Number(v ?? 0))} />
                <Bar dataKey="publicCostUsd" name="Public cost" radius={[4, 4, 0, 0]}>
                  {versusData.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "nycSplit" ? (
        <ChartCard
          title="NYC 467-m: tax expenditure vs opportunity cost"
          subtitle="Lower Manhattan opportunity cost exceeds tax expenditure because the counterfactual is fully taxable residential."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={nycSplitData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => `$${v}B`}
                  tick={{ fontSize: 11 }}
                  label={{ value: "PV $B", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => `$${v}M`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="taxExp" name="Tax expenditure $B" fill={COLORS.tax} />
                <Bar yAxisId="left" dataKey="oppCost" name="Opportunity cost $B" fill={COLORS.opp} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="perIr"
                  name="$M per IR unit"
                  stroke={COLORS.grant}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "schedule" ? (
        <ChartCard
          title="How long the public dollar stays on the table"
          subtitle="NYC exemption depth (%), DC abatement years (on/off), Calgary grant (year 0 only)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scheduleData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Area
                  type="stepAfter"
                  dataKey="nyc"
                  name="NYC exemption %"
                  stroke={COLORS.tax}
                  fill={COLORS.tax}
                  fillOpacity={0.25}
                />
                <Area
                  type="stepAfter"
                  dataKey="dc"
                  name="DC abatement on"
                  stroke={COLORS.framing}
                  fill={COLORS.framing}
                  fillOpacity={0.2}
                />
                <Area
                  type="stepAfter"
                  dataKey="calgary"
                  name="Calgary grant %"
                  stroke={COLORS.grant}
                  fill={COLORS.grant}
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
