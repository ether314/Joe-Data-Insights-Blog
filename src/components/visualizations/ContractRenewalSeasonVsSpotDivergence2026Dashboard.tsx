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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  EQUIPMENT_SPREADS,
  HEADLINE,
  MONTHLY_TAPE,
  RENEWAL_SCATTER,
  RENEWAL_WINDOWS,
  SECTOR_BIDS,
  SOURCE_NOTE,
  VIZ_MARKERS,
  bidLiftForYear,
  ratesForEquipment,
  spreadForEquipment,
  type Equipment,
} from "@/data/contract-renewal-season-vs-spot-divergence-2026-data";

type Panel = "tape" | "ladder" | "cass" | "scatter" | "equipment";
type BidYear = 2021 | 2022 | 2023 | 2024 | 2025;

const COLORS = {
  spot: "#0ea5e9",
  contract: "#6366f1",
  spread: "#f59e0b",
  cass: "#059669",
  food: "#dc2626",
  muted: "#94a3b8",
  ink: "#0f172a",
};

const EQUIP_COLORS: Record<Equipment, string> = {
  van: "#0ea5e9",
  reefer: "#06b6d4",
  flatbed: "#d97706",
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

const PANEL_LABEL: Record<Panel, string> = {
  tape: "Dual rate tape",
  ladder: "Sector bid ladder",
  cass: "Cass vs spread",
  scatter: "Renewal scatter",
  equipment: "Equipment mix",
};

export function ContractRenewalSeasonVsSpotDivergence2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("tape");
  const [equipment, setEquipment] = useState<Equipment>("van");
  const [bidYear, setBidYear] = useState<BidYear>(2022);

  const tape = useMemo(
    () =>
      MONTHLY_TAPE.map((row) => {
        const { spot, contract } = ratesForEquipment(row, equipment);
        return {
          ...row,
          spot,
          contract,
          spread: Math.round((spot - contract) * 100) / 100,
        };
      }),
    [equipment],
  );

  const ladder = useMemo(() => {
    return [...SECTOR_BIDS]
      .map((s) => ({
        ...s,
        lift: bidLiftForYear(s, bidYear),
      }))
      .sort((a, b) => b.lift - a.lift);
  }, [bidYear]);

  const cassSeries = useMemo(
    () =>
      MONTHLY_TAPE.map((row) => ({
        label: row.label,
        spread: Math.round(spreadForEquipment(row, "van") * 100) / 100,
        cassExpenditures: row.cassExpenditures,
        cassShipments: row.cassShipments,
        renewal: row.renewalSeason,
      })),
    [],
  );

  return (
    <div
      className="space-y-4"
      data-viz="contract-renewal-season-vs-spot-divergence-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-lg font-bold leading-snug sm:text-xl">
          Van spot–contract spread peaked at{" "}
          <span className="text-amber-300">
            +${HEADLINE.peakVanSpreadUsd.toFixed(2)}/mi
          </span>{" "}
          (Jul 2022) —{" "}
          <span className="text-sky-300">{HEADLINE.topSector}</span> still took
          the largest fall-2022 renewal lift (
          <span className="text-amber-300">
            +{HEADLINE.topSectorBidLiftPct}%
          </span>{" "}
          YoY).
        </p>
        <p className="mt-2 text-xs text-slate-300 sm:text-sm">
          DAT national linehaul · Cass Freight Index · shipper bid-cycle
          restatement · {SOURCE_NOTE.slice(0, 120)}…
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PANEL_LABEL) as Panel[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPanel(p)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              panel === p
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {PANEL_LABEL[p]}
          </button>
        ))}
      </div>

      {(panel === "tape" || panel === "equipment") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Equipment
          </span>
          {(["van", "reefer", "flatbed"] as Equipment[]).map((eq) => (
            <button
              key={eq}
              type="button"
              onClick={() => setEquipment(eq)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                equipment === eq
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {eq}
            </button>
          ))}
        </div>
      )}

      {panel === "ladder" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Renewal year
          </span>
          {([2021, 2022, 2023, 2024, 2025] as BidYear[]).map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setBidYear(y)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                bidYear === y
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Fall {y}
            </button>
          ))}
        </div>
      )}

      {panel === "tape" && (
        <ChartCard
          title="Dual rate tape"
          subtitle={`National ${equipment} spot vs contract ($/mi) with spread ribbon — peak +$${HEADLINE.peakVanSpreadUsd}/mi on van in Jul 2022`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={tape} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis
                  yAxisId="rate"
                  tick={{ fontSize: 11 }}
                  domain={[1.4, 3.4]}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  yAxisId="spread"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[-0.4, 0.9]}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const label = String(name);
                    return [
                      label === "spread"
                        ? `$${n.toFixed(2)}/mi`
                        : `$${n.toFixed(2)}`,
                      label,
                    ];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="spread"
                  dataKey="spread"
                  name="spread"
                  fill={COLORS.spread}
                  opacity={0.35}
                  maxBarSize={18}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="spot"
                  name="spot"
                  stroke={COLORS.spot}
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="contract"
                  name="contract"
                  stroke={COLORS.contract}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "ladder" && (
        <ChartCard
          title="Sector bid ladder"
          subtitle={`Fall ${bidYear} YoY contract-award lift by shipper vertical — food & beverage led 2022 at +${HEADLINE.topSectorBidLiftPct}%`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladder}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    return [`${n > 0 ? "+" : ""}${n}% YoY`, "Bid lift"];
                  }}
                />
                <Bar dataKey="lift" name="Bid lift" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {ladder.map((row) => (
                    <Cell
                      key={row.sector}
                      fill={
                        row.sector === "food-bev"
                          ? COLORS.food
                          : row.lift < 0
                            ? COLORS.muted
                            : EQUIP_COLORS[row.equipment]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cass" && (
        <ChartCard
          title="Cass vs spread"
          subtitle="Cass Freight Index expenditures vs national van spot−contract spread — renewal months shaded via higher bar opacity"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cassSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis
                  yAxisId="cass"
                  tick={{ fontSize: 11 }}
                  domain={[0.8, 1.6]}
                />
                <YAxis
                  yAxisId="spread"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[-0.4, 0.9]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="cass"
                  dataKey="cassExpenditures"
                  name="Cass expenditures"
                  fill={COLORS.cass}
                  opacity={0.55}
                  maxBarSize={16}
                />
                <Line
                  yAxisId="spread"
                  type="monotone"
                  dataKey="spread"
                  name="Van spread $/mi"
                  stroke={COLORS.spread}
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {RENEWAL_WINDOWS.map((w) => (
              <div
                key={w.year}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
              >
                <p className="font-semibold text-slate-800">{w.label}</p>
                <p className="text-slate-600">
                  Mean bid {w.meanBidLiftPct > 0 ? "+" : ""}
                  {w.meanBidLiftPct}%
                </p>
                <p className="text-slate-500">Top: {w.topSector}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Renewal scatter"
          subtitle="Fall-2022 bid lift vs equipment spread at the Jul-2022 peak — bubble size = lane-mile share"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="spreadAtPeak"
                  name="Spread"
                  unit="/mi"
                  tick={{ fontSize: 11 }}
                  domain={[0.5, 0.85]}
                  label={{
                    value: "Equipment spread at peak ($/mi)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="bidLift2022"
                  name="Bid lift"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[5, 22]}
                  label={{
                    value: "Fall-2022 bid lift %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="laneSharePct" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const label = String(name);
                    if (label === "Bid lift") return [`+${n}%`, label];
                    if (label === "Spread") return [`$${n}/mi`, label];
                    return [n, label];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { label?: string } | undefined)
                      ?.label ?? ""
                  }
                />
                <Scatter data={RENEWAL_SCATTER} name="Sectors">
                  {RENEWAL_SCATTER.map((p) => (
                    <Cell
                      key={p.sector}
                      fill={
                        p.sector === "food-bev"
                          ? COLORS.food
                          : EQUIP_COLORS[p.equipment]
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Spot beta vs 2022 bid-lift correlation ≈ 0.41 — RFPs do not price
            one-for-one off the national spot print.
          </p>
        </ChartCard>
      )}

      {panel === "equipment" && (
        <ChartCard
          title="Equipment mix"
          subtitle="Peak / trough / mid-2026 spot−contract spreads by trailer type"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={EQUIPMENT_SPREADS}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    return [`$${n.toFixed(2)}/mi`, ""];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="peakSpread"
                  name="Peak spread"
                  fill={COLORS.spread}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="troughSpread"
                  name="Trough spread"
                  fill={COLORS.muted}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="mid2026Spread"
                  name="Mid-2026 spread"
                  fill={EQUIP_COLORS[equipment]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Active equipment control: <span className="font-medium capitalize">{equipment}</span>{" "}
            — use Dual rate tape for the full path on that fleet.
          </p>
        </ChartCard>
      )}
    </div>
  );
}
