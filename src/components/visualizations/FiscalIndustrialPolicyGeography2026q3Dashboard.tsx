"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
  CORRIDOR_INTENSITY,
  EU_MEMBER_SHARES,
  HEADLINE,
  JUNE_FLOW,
  METER_COMPARE,
  MONTHLY_FLOW_PATH,
  REGION_SHARES,
  SECTOR_REGION,
  SOURCE_NOTE,
  US_STATE_AWARDS,
  VINTAGE_SLOPE,
  fmtPct,
  fmtPp,
  fmtUsdBn,
  jurisdictionScatter,
  mismatchBars,
} from "@/data/fiscal-industrial-policy-geography-2026q3-data";

// viz-types: mismatch bars, region dual+pie, count×$ scatter, monthly area+line, US/EU ladders+donuts, corridor stacked, vintage slope | layout: default

type ViewId = "mismatch" | "flow" | "subnational" | "corridors";
type SubnationalLens = "us" | "eu";
type CorridorTheme = "semisPct" | "cleanPct" | "dualUsePct" | "mineralsPct";
type SlopeMetric =
  | "eastAsiaStockPct"
  | "naPackagePct"
  | "juneRowPct"
  | "usTop3StatePct";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const AMBER = "#f59e0b";

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

export function FiscalIndustrialPolicyGeography2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("mismatch");
  const [subnational, setSubnational] = useState<SubnationalLens>("us");
  const [corridorTheme, setCorridorTheme] =
    useState<CorridorTheme>("semisPct");
  const [slopeMetric, setSlopeMetric] =
    useState<SlopeMetric>("naPackagePct");

  const mismatch = useMemo(() => mismatchBars(), []);
  const scatter = useMemo(() => jurisdictionScatter(), []);

  const regionDual = useMemo(
    () =>
      [...REGION_SHARES]
        .sort((a, b) => b.stockSharePct - a.stockSharePct)
        .map((r) => ({
          short: r.short,
          Stock: r.stockSharePct,
          Packages: r.packageSharePct,
          fill: r.fill,
        })),
    [],
  );

  const junePie = useMemo(() => [...JUNE_FLOW], []);

  const flowPath = useMemo(
    () =>
      MONTHLY_FLOW_PATH.map((m) => ({
        month: m.month.replace(" 2026", ""),
        total: m.total,
        RoW: m.rowSharePct,
        US: m.usSharePct,
        EU: m.euSharePct,
        China: m.chinaSharePct,
      })),
    [],
  );

  const usBars = useMemo(
    () => [...US_STATE_AWARDS].sort((a, b) => b.awardUsdBn - a.awardUsdBn),
    [],
  );
  const euBars = useMemo(
    () => [...EU_MEMBER_SHARES].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  const corridorStack = useMemo(() => {
    const key = corridorTheme;
    return CORRIDOR_INTENSITY.map((c) => ({
      short: c.short,
      value: c[key],
      fill: c.fill,
    })).sort((a, b) => b.value - a.value);
  }, [corridorTheme]);

  const sectorStack = useMemo(
    () =>
      SECTOR_REGION.map((s) => ({
        sector: s.short,
        "E. Asia": s.eastAsiaPct,
        "N. America": s.northAmericaPct,
        Europe: s.europePct,
        RoW: s.rowPct,
      })),
    [],
  );

  const slopeData = useMemo(
    () =>
      VINTAGE_SLOPE.map((v) => ({
        vintage: v.vintage.replace("Geography ", "Geo "),
        value: v[slopeMetric],
      })),
    [slopeMetric],
  );

  const meterBars = useMemo(
    () => [...METER_COMPARE].sort((a, b) => b.topSharePct - a.topSharePct),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Fiscal & industrial policy — Q3 geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Regional shares that disagree on who leads
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          East Asia still leads stock counts (~{HEADLINE.eastAsiaStockSharePct}
          %), North America owns ~{fmtPct(HEADLINE.northAmericaPackageSharePct, 0)}{" "}
          of package dollars (+{HEADLINE.naMismatchPp.toFixed(0)} pp mismatch),
          DE·FR·IT hold ~{HEADLINE.euTop3MemberSharePct}% of the EU IPCEI tip,
          and June&apos;s tape still leaves {HEADLINE.juneRowSharePct}% to RoW
          even as July volume jumped {HEADLINE.julVsMayDeltaPct}% vs May.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "NA package mismatch",
              value: fmtPp(HEADLINE.naMismatchPp, 0),
            },
            {
              label: "E. Asia stock",
              value: fmtPct(HEADLINE.eastAsiaStockSharePct),
            },
            {
              label: "EU top-3 members",
              value: fmtPct(HEADLINE.euTop3MemberSharePct),
            },
            {
              label: "June RoW flow",
              value: fmtPct(HEADLINE.juneRowSharePct),
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
            { id: "mismatch", label: "Mismatch" },
            { id: "flow", label: "Flow path" },
            { id: "subnational", label: "Subnational" },
            { id: "corridors", label: "Corridors" },
          ]}
        />
        {view === "subnational" && (
          <ToggleGroup
            label="Lens"
            value={subnational}
            onChange={setSubnational}
            options={[
              { id: "us", label: "US states" },
              { id: "eu", label: "EU members" },
            ]}
          />
        )}
        {view === "corridors" && (
          <>
            <ToggleGroup
              label="Theme"
              value={corridorTheme}
              onChange={setCorridorTheme}
              options={[
                { id: "semisPct", label: "Semis" },
                { id: "cleanPct", label: "Clean" },
                { id: "dualUsePct", label: "Dual-use" },
                { id: "mineralsPct", label: "Minerals" },
              ]}
            />
            <ToggleGroup
              label="Slope"
              value={slopeMetric}
              onChange={setSlopeMetric}
              options={[
                { id: "naPackagePct", label: "NA packages" },
                { id: "eastAsiaStockPct", label: "E. Asia stock" },
                { id: "juneRowPct", label: "June RoW" },
                { id: "usTop3StatePct", label: "US top-3" },
              ]}
            />
          </>
        )}
      </div>

      {view === "mismatch" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Stock–package mismatch by region"
            subtitle="Package share minus stock share (pp). Positive = fiscal firepower exceeds count share."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mismatch}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[-35, 55]}
                    tickFormatter={(v) => `${v}`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPp(Number(v), 1), "Mismatch"]}
                  />
                  <Bar dataKey="mismatchPp" radius={[0, 4, 4, 0]}>
                    {mismatch.map((r) => (
                      <Cell
                        key={r.region}
                        fill={r.mismatchPp >= 0 ? SKY : ROSE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stock vs package dual ladder"
            subtitle="Same four regions on two meters — counts vs war-chest dollars"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionDual}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 1), ""]}
                  />
                  <Bar dataKey="Stock" fill={ROSE} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Packages" fill={SKY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Count × package scatter"
            subtitle="Bubble size ∝ package $B. US sits far right on dollars; China leads counts."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Stock %"
                    unit="%"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Stock share %",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Package %"
                    unit="%"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Package %",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 600]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x") return [fmtPct(Number(v), 1), "Stock"];
                      if (name === "y")
                        return [fmtPct(Number(v), 1), "Package"];
                      return [fmtUsdBn(Number(v), 1), "Package $"];
                    }}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.short ?? "")
                    }
                  />
                  <Scatter data={scatter} fill={SKY}>
                    {scatter.map((j) => (
                      <Cell key={j.short} fill={j.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Meter compare — who is 'on top'?"
            subtitle="Top-region share across stock, packages, June flow, US states, EU members"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meterBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 80]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={80}
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtPct(Number(v), 1)} (${item?.payload?.topRegion})`,
                      "Top share",
                    ]}
                  />
                  <Bar dataKey="topSharePct" fill={VIOLET} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "flow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="May→Jul monthly flow path"
            subtitle="Disclosed totals; June bloc shares disclosed, May/Jul regional shares editorial"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={flowPath}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 70]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="RoW"
                    stackId="share"
                    fill={SLATE}
                    stroke={SLATE}
                    fillOpacity={0.35}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="US"
                    stackId="share"
                    fill={SKY}
                    stroke={SKY}
                    fillOpacity={0.55}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="EU"
                    stackId="share"
                    fill={VIOLET}
                    stroke={VIOLET}
                    fillOpacity={0.55}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="China"
                    stackId="share"
                    fill={ROSE}
                    stroke={ROSE}
                    fillOpacity={0.55}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: AMBER }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="June 2026 disclosed geography"
            subtitle={`${HEADLINE.juneTotal} interventions — RoW ${HEADLINE.juneRowSharePct}% vs Big Three ${HEADLINE.juneTop3BlocSharePct}%`}
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={junePie}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {junePie.map((d) => (
                      <Cell key={d.short} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtPct(Number(v))} (${item?.payload?.interventions})`,
                      item?.payload?.bloc,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {junePie.map((d) => (
                <span key={d.short} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.fill }}
                  />
                  {d.short} {fmtPct(d.sharePct)}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "subnational" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {subnational === "us" ? (
            <>
              <ChartCard
                title="US CHIPS megaproject award ladder"
                subtitle={`Tracked tip ~${fmtUsdBn(HEADLINE.usTrackedAwardsUsdBn, 1)} — ${HEADLINE.usTop3StatesLabel} ≈ ${HEADLINE.usTop3StateAwardSharePct}%`}
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={usBars}
                      layout="vertical"
                      margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => `$${v}B`}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="short"
                        width={48}
                        tick={{ fill: "#334155", fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(v, _n, item) => [
                          `${fmtUsdBn(Number(v), 1)} (${fmtPct(item?.payload?.sharePct, 1)})`,
                          item?.payload?.state,
                        ]}
                      />
                      <Bar dataKey="awardUsdBn" radius={[0, 4, 4, 0]}>
                        {usBars.map((s) => (
                          <Cell key={s.short} fill={s.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard
                title="US state award share donut"
                subtitle="Facility-geography tip — not full Commerce disbursement census"
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usBars}
                        dataKey="sharePct"
                        nameKey="short"
                        cx="50%"
                        cy="50%"
                        innerRadius={64}
                        outerRadius={108}
                        paddingAngle={2}
                      >
                        {usBars.map((s) => (
                          <Cell key={s.short} fill={s.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [fmtPct(Number(v), 1), "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          ) : (
            <>
              <ChartCard
                title="EU IPCEI / Chips Act member ladder"
                subtitle={`Tracked tip ~${fmtUsdBn(HEADLINE.euIpceiTipUsdBn, 0)} — ${HEADLINE.euTop3MembersLabel} ≈ ${HEADLINE.euTop3MemberSharePct}%`}
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={euBars}
                      layout="vertical"
                      margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="short"
                        width={48}
                        tick={{ fill: "#334155", fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(v, _n, item) => [
                          `${fmtPct(Number(v))} (~${fmtUsdBn(item?.payload?.tipUsdBn, 1)})`,
                          item?.payload?.member,
                        ]}
                      />
                      <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                        {euBars.map((s) => (
                          <Cell key={s.short} fill={s.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard
                title="EU member share donut"
                subtitle="Inside EU-bloc package geography — not full member IP outlays"
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={euBars}
                        dataKey="sharePct"
                        nameKey="short"
                        cx="50%"
                        cy="50%"
                        innerRadius={64}
                        outerRadius={108}
                        paddingAngle={2}
                      >
                        {euBars.map((s) => (
                          <Cell key={s.short} fill={s.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [fmtPct(Number(v)), "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          )}
        </div>
      )}

      {view === "corridors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Strategic corridor intensity"
            subtitle="Share of selected theme’s geography by Indo-Pacific / Transatlantic / RoW"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={corridorStack}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "Share"]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {corridorStack.map((c) => (
                      <Cell key={c.short} fill={c.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Sector × region stacked shares"
            subtitle="Estimated regional intensity inside each strategic sector"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorStack}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="sector"
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="E. Asia" stackId="a" fill={ROSE} />
                  <Bar dataKey="N. America" stackId="a" fill={SKY} />
                  <Bar dataKey="Europe" stackId="a" fill={VIOLET} />
                  <Bar dataKey="RoW" stackId="a" fill={SLATE} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Vintage slope of geography meters"
            subtitle="Research → Geography 2026 → Q3 — meters are sticky; Q3 adds mismatch + EU lens"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={slopeData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="vintage"
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[50, 75]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 1), "Meter"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill={SKY}
                    stroke={SKY}
                    fillOpacity={0.2}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={SKY}
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: SKY }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Source note"
            subtitle="Read before quoting any regional share"
          >
            <p className="text-sm leading-relaxed text-slate-600">
              {SOURCE_NOTE}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Regional stock HHI (4-bucket) ≈ {HEADLINE.regionStockHhi}; package
              HHI ≈ {HEADLINE.regionPackageHhi}. July volume{" "}
              {HEADLINE.julTotal} vs May {HEADLINE.mayTotal} (+
              {HEADLINE.julVsMayDeltaPct}%).
            </p>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
