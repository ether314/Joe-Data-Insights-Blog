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
  LOSS_METRIC_OPTIONS,
  SOURCE_NOTE,
  SOURCES,
  WINDOW_OPTIONS,
  demandStockRows,
  dualAxisRows,
  fmtM,
  fmtPct,
  lossPct,
  scatterLossVsAcres,
  seasonsForWindow,
  stockingScenarios,
  type LossMetric,
  type WindowId,
} from "@/data/usda-honey-bee-colony-loss-versus-almond-pollination-acres-2026-data";

// viz-types: dual-axis loss+acres composed, demand-vs-stock bars+line,
// scatter loss vs acres, stocking-rate ladder bars | controls: panel, loss metric, year window

type PanelId = "dual" | "demand" | "scatter" | "stocking" | "table";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "dual", label: "Loss vs acres" },
  { id: "demand", label: "Demand vs stock" },
  { id: "scatter", label: "Scatter" },
  { id: "stocking", label: "Stocking ladder" },
  { id: "table", label: "Season table" },
];

const AMBER = "#d97706";
const TEAL = "#0f766e";
const SLATE = "#475569";
const ROSE = "#e11d48";
const GRID = "#e2e8f0";

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
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={
                active
                  ? "rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                  : "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function UsdaHoneyBeeColonyLossVersusAlmondPollinationAcres2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("dual");
  const [metric, setMetric] = useState<LossMetric>("winter");
  const [window, setWindow] = useState<WindowId>("all");

  const metricLabel =
    LOSS_METRIC_OPTIONS.find((o) => o.id === metric)?.label ?? metric;

  const dual = useMemo(() => dualAxisRows(window, metric), [window, metric]);
  const demand = useMemo(() => demandStockRows(window), [window]);
  const scatter = useMemo(
    () => scatterLossVsAcres(window, metric),
    [window, metric],
  );
  const seasons = useMemo(() => seasonsForWindow(window), [window]);
  const latest = seasons[seasons.length - 1] ?? seasons[0];
  const ladder = useMemo(
    () =>
      stockingScenarios(
        latest?.almondBearingAcresK ?? HEADLINE.latestAlmondAcresK,
        latest?.usJanColoniesM ?? HEADLINE.latestUsJanColoniesM,
      ),
    [latest],
  );

  return (
    <div
      className="w-full space-y-4"
      data-viz="usda-honey-bee-colony-loss-versus-almond-pollination-acres-2026"
    >
      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-teal-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">
          Winter loss vs almond acres
        </p>
        <p className="mt-1 text-base text-slate-800 sm:text-lg">
          {HEADLINE.latestSeason} winter loss hit{" "}
          <span className="font-semibold text-rose-700">
            {fmtPct(HEADLINE.latestWinterLossPct)}
          </span>{" "}
          while California bearing acres sat at{" "}
          <span className="font-semibold text-teal-800">
            {HEADLINE.latestAlmondAcresK.toLocaleString()}k
          </span>
          — implying ~{fmtM(HEADLINE.latestHiveDemandM)} rented hives at 2/acre
          against a {fmtM(HEADLINE.latestUsJanColoniesM)} Jan-1 U.S. stock.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTIONS}
          onChange={setPanel}
        />
        <ToggleGroup
          label="Loss metric"
          value={metric}
          options={[...LOSS_METRIC_OPTIONS]}
          onChange={setMetric}
        />
        <ToggleGroup
          label="Window"
          value={window}
          options={[...WINDOW_OPTIONS]}
          onChange={setWindow}
        />
      </div>

      {panel === "dual" ? (
        <ChartCard
          title={`${metricLabel} vs California almond bearing acres`}
          subtitle="Left axis: BIP/AIA national total loss rate. Right axis: USDA NASS CA bearing acres (000s)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dual} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="season" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="loss"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 60]}
                />
                <YAxis
                  yAxisId="acres"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}k`}
                  domain={[900, 1500]}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="acres"
                  type="monotone"
                  dataKey="almondAcresK"
                  name="Almond acres (000s)"
                  fill="#99f6e4"
                  stroke={TEAL}
                  strokeWidth={2}
                  fillOpacity={0.35}
                />
                <Line
                  yAxisId="loss"
                  type="monotone"
                  dataKey="lossPct"
                  name={metricLabel}
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "demand" ? (
        <ChartCard
          title="Implied almond hive demand vs Jan-1 U.S. colony stock"
          subtitle="Demand = bearing acres × 2 colonies/acre. Stock = USDA NASS Jan-1 colonies (ops with 5+)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={demand} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="season" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="m"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                  domain={[1.8, 3.2]}
                />
                <YAxis
                  yAxisId="share"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[60, 120]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="m"
                  dataKey="hiveDemandM"
                  name="Implied demand (M)"
                  fill={AMBER}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="m"
                  dataKey="usJanColoniesM"
                  name="U.S. Jan-1 stock (M)"
                  fill={SLATE}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="demandSharePct"
                  name="Demand / stock %"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title={`${metricLabel} vs almond acres`}
          subtitle="Each point is a bloom year. Marker size scales with demand/stock share."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="acresK"
                  name="Almond acres (000s)"
                  tick={{ fontSize: 11 }}
                  domain={[900, 1450]}
                  label={{
                    value: "CA almond bearing acres (000s)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="lossPct"
                  name="Loss %"
                  tick={{ fontSize: 11 }}
                  domain={[15, 60]}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis type="number" dataKey="demandSharePct" range={[60, 280]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Season" data={scatter} fill={ROSE}>
                  {scatter.map((row) => (
                    <Cell
                      key={row.season}
                      fill={row.demandSharePct >= 100 ? ROSE : AMBER}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "stocking" ? (
        <ChartCard
          title={`Stocking-rate ladder · ${latest?.bloomYear ?? HEADLINE.latestBloomYear} bloom`}
          subtitle={`${latest?.almondBearingAcresK.toLocaleString() ?? HEADLINE.latestAlmondAcresK}k bearing acres vs ${fmtM(latest?.usJanColoniesM ?? HEADLINE.latestUsJanColoniesM)} Jan-1 U.S. colonies.`}
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ladder}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                  domain={[0, 4]}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="demandM" name="Implied demand (M)" radius={[0, 4, 4, 0]}>
                  {ladder.map((row) => (
                    <Cell
                      key={row.id}
                      fill={row.vsJanStockPct >= 100 ? ROSE : TEAL}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
            {ladder.map((row) => (
              <li key={row.id} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-800">{row.coloniesPerAcre}/acre</span>
                : {fmtM(row.demandM)} · {row.vsJanStockPct}% of Jan stock
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {panel === "table" ? (
        <ChartCard
          title="Season ledger"
          subtitle="Winter / annual loss rates paired with CA almond acres and implied hive demand."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2">Season</th>
                  <th className="px-2 py-2">Winter</th>
                  <th className="px-2 py-2">Annual</th>
                  <th className="px-2 py-2">Acres (k)</th>
                  <th className="px-2 py-2">Demand (M)</th>
                  <th className="px-2 py-2">Jan stock (M)</th>
                  <th className="px-2 py-2">Demand/stock</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((r) => (
                  <tr key={r.season} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium text-slate-800">
                      {r.season}
                    </td>
                    <td className="px-2 py-2">{fmtPct(r.winterLossPct)}</td>
                    <td className="px-2 py-2">{fmtPct(r.annualLossPct)}</td>
                    <td className="px-2 py-2">
                      {r.almondBearingAcresK.toLocaleString()}
                    </td>
                    <td className="px-2 py-2">{fmtM(r.hiveDemandM)}</td>
                    <td className="px-2 py-2">{fmtM(r.usJanColoniesM)}</td>
                    <td className="px-2 py-2">
                      {fmtPct(r.demandShareOfStock * 100, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-slate-300 hover:text-slate-700"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
      {/* keep lossPct referenced for tree-shake safety in table metric swaps */}
      <span className="hidden">{lossPct(latest, metric)}</span>
    </div>
  );
}
