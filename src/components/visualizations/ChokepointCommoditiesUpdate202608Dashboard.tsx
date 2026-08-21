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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  FERTILIZER_PATH,
  HEADLINE,
  PRICE_PATH,
  SMELTER_RESPONSE,
  SOURCE_NOTE,
  STRESS_SCATTER,
  VINTAGE_ROWS,
  YOY_DELTAS,
  deltaBuckets,
  filterVintage,
  filterYoy,
  fmtPct,
  fmtUsd,
  rankedByAbsDelta,
  type Direction,
  type Sector,
  type Stage,
} from "@/data/chokepoint-commodities-update-202608-data";

// viz-types: YoY Δ bars, copper/metals line path, price×concentration scatter, fertilizer area, smelter response composed | layout: default
// viz-plan: Pink Sheet Jul copper +36% YoY; metals idx +25%; tin +56%; spot TC −$90; China cut/halt; fertilizer rock break

type Panel = "yoy" | "path" | "scatter" | "fertilizer" | "smelter" | "ledger";
type MetalKey = "copper" | "nickel" | "aluminum" | "tin" | "zinc";

const DIRECTION_COLORS: Record<Direction, string> = {
  tighter: "#ea580c",
  easier: "#14b8a6",
  flat: "#64748b",
  revised: "#a78bfa",
};

const METAL_COLORS: Record<MetalKey, string> = {
  copper: "#ea580c",
  nickel: "#0ea5e9",
  aluminum: "#64748b",
  tin: "#a855f7",
  zinc: "#14b8a6",
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

export function ChokepointCommoditiesUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("yoy");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [direction, setDirection] = useState<Direction | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");
  const [metal, setMetal] = useState<MetalKey>("copper");

  const filtered = useMemo(
    () => filterVintage(VINTAGE_ROWS, { stage, direction, sector }),
    [stage, direction, sector],
  );

  const yoyBars = useMemo(
    () =>
      filterYoy(YOY_DELTAS, {
        stage: stage === "mine" || stage === "midstream" || stage === "smelter" ? "all" : stage,
        direction,
      })
        .slice()
        .sort((a, b) => b.yoyPct - a.yoyPct)
        .map((r) => ({
          name: r.shortLabel,
          yoy: r.yoyPct,
          fill: DIRECTION_COLORS[r.direction],
          prior: r.priorUsd,
          neu: r.newUsd,
        })),
    [stage, direction],
  );

  const ledgerBars = useMemo(
    () =>
      rankedByAbsDelta(filtered).map((r) => ({
        name: r.shortLabel,
        delta: r.delta,
        fill: DIRECTION_COLORS[r.direction],
        unit: r.deltaUnit,
      })),
    [filtered],
  );

  const scatter = useMemo(
    () =>
      STRESS_SCATTER.filter((p) => {
        if (stage !== "all" && p.stage !== stage) return false;
        return true;
      }).map((p) => ({
        name: p.label,
        yoy: p.yoyPct,
        conc: p.concentrationPct,
        z: Math.abs(p.yoyPct) * 4 + 40,
        fill:
          p.yoyPct >= 30
            ? DIRECTION_COLORS.tighter
            : p.yoyPct >= 15
              ? "#f59e0b"
              : DIRECTION_COLORS.revised,
      })),
    [stage],
  );

  const smelterBars = useMemo(
    () =>
      SMELTER_RESPONSE.map((r) => ({
        name: r.shortLabel,
        value: r.value,
        unit: r.unit,
      })),
    [],
  );

  const buckets = useMemo(() => deltaBuckets(filtered), [filtered]);

  return (
    <div className="space-y-6" data-viz="chokepoint-commodities-update-202608">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — {HEADLINE.priorVintage} → {HEADLINE.newVintage}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Copper Jul {fmtUsd(HEADLINE.cu2026JulUsd)}/mt ({fmtPct(HEADLINE.cuYoyPct)} YoY) · Metals
          idx {HEADLINE.metalsIdx2026Jul} ({fmtPct(HEADLINE.metalsIdxYoyPct)}) · Spot TC ~
          {HEADLINE.cuTcRcSpotMar2026Usd}$/t
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Versus the Q3 IEA GCMO midstream print, the newest official price vintage — World Bank Pink
          Sheet August 2026 (July monthly) — prices the same thin gates hotter: copper +36% YoY, tin
          +56%, metals index +25%, while spot treatment charges deepened below the $0/t annual settle
          and China answered with a &gt;10% smelter cut plus ~2 Mt halted planned capacity. Refine
          shares hold at Q3 levels; the August move is stress, not a new mine census.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <ToggleGroup
            label="Panel"
            value={panel}
            onChange={setPanel}
            options={[
              { id: "yoy", label: "YoY Δ" },
              { id: "path", label: "Price path" },
              { id: "scatter", label: "Price × conc." },
              { id: "fertilizer", label: "Fertilizer" },
              { id: "smelter", label: "Smelter reply" },
              { id: "ledger", label: "Full ledger" },
            ]}
          />
          <ToggleGroup
            label="Stage"
            value={stage}
            onChange={setStage}
            options={[
              { id: "all", label: "All stages" },
              { id: "price", label: "Price" },
              { id: "smelter", label: "Smelter" },
              { id: "fertilizer", label: "Fertilizer" },
              { id: "midstream", label: "Midstream" },
              { id: "mine", label: "Mine" },
            ]}
          />
          <ToggleGroup
            label="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { id: "all", label: "All" },
              { id: "tighter", label: "Tighter" },
              { id: "easier", label: "Easier" },
              { id: "flat", label: "Flat" },
              { id: "revised", label: "Revised" },
            ]}
          />
          <ToggleGroup
            label="Sector"
            value={sector}
            onChange={setSector}
            options={[
              { id: "all", label: "All sectors" },
              { id: "structural", label: "Structural" },
              { id: "batteries", label: "Batteries" },
              { id: "fertilizers", label: "Fertilizers" },
              { id: "semiconductors", label: "Semiconductors" },
              { id: "magnets", label: "Magnets" },
            ]}
          />
          {panel === "path" && (
            <ToggleGroup
              label="Metal"
              value={metal}
              onChange={setMetal}
              options={[
                { id: "copper", label: "Copper" },
                { id: "nickel", label: "Nickel" },
                { id: "aluminum", label: "Aluminum" },
                { id: "tin", label: "Tin" },
                { id: "zinc", label: "Zinc" },
              ]}
            />
          )}
        </div>
      </div>

      {panel === "yoy" && (
        <ChartCard
          title="July 2026 vs 2025 annual YoY (%)"
          subtitle="World Bank Pink Sheet August 2026 — metals, fertilizers, and index"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={yoyBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      name: string;
                      yoy: number;
                      prior: number;
                      neu: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{d.name}</div>
                        <div>{fmtPct(d.yoy)} YoY</div>
                        <div>
                          {fmtUsd(d.prior)} → {fmtUsd(d.neu)}
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="yoy" name="YoY %" radius={[0, 4, 4, 0]}>
                  {yoyBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${metal[0].toUpperCase()}${metal.slice(1)} price path`}
            subtitle="Pink Sheet annual → quarterly → monthly ($/mt)"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={PRICE_PATH} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const sorted = sortTooltipPayload(payload);
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          {sorted.map((p) => (
                            <div key={String(p.dataKey)}>
                              {p.name}: {fmtUsd(Number(p.value))}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={metal}
                    name={metal}
                    stroke={METAL_COLORS[metal]}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Metals & minerals index"
            subtitle="2010=100 — May peak 148.8, July 140.5 still +25% vs 2025 annual"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={PRICE_PATH} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[90, 160]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          Index: {Number(payload[0]?.value).toFixed(1)}
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="metalsIdx"
                    name="Metals idx"
                    stroke="#0f172a"
                    fill="#fdba74"
                    fillOpacity={0.45}
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    y={HEADLINE.metalsIdx2025}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{ value: "2025 ann.", fontSize: 10, fill: "#64748b" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Price stress vs concentration hold"
          subtitle="X = Q3 top-share / capacity hold (%); Y = Pink Sheet Jul YoY (%); size ∝ |YoY|"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="conc"
                  name="Concentration"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[30, 85]}
                />
                <YAxis
                  type="number"
                  dataKey="yoy"
                  name="YoY"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[0, 65]}
                />
                <ZAxis type="number" dataKey="z" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      name: string;
                      yoy: number;
                      conc: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{d.name}</div>
                        <div>
                          {fmtPct(d.yoy)} YoY · ~{d.conc}% conc. hold
                        </div>
                      </div>
                    );
                  }}
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
      )}

      {panel === "fertilizer" && (
        <ChartCard
          title="Fertilizer chokepoint prices"
          subtitle="Phosphate rock broke higher in July after a flat $152.5 print; DAP and potash already elevated"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart data={FERTILIZER_PATH} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Legend />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        {sorted.map((p) => (
                          <div key={String(p.dataKey)}>
                            {p.name}: {fmtUsd(Number(p.value))}
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="phosphateRock"
                  name="Phos rock"
                  stroke="#ca8a04"
                  fill="#fde68a"
                  fillOpacity={0.5}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="potash"
                  name="Potash"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="dap"
                  name="DAP"
                  fill="#ea580c"
                  opacity={0.75}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "smelter" && (
        <ChartCard
          title="Copper smelter reply after $0/t settle"
          subtitle="Benchmark TC $0 → spot ~−$90; China >10% cut (~961 kt) and ~2 Mt planned capacity halted"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={smelterBars} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      name: string;
                      value: number;
                      unit: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        {d.name}: {d.value}
                        {d.unit}
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
                  {smelterBars.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.value < 0 ? "#ea580c" : d.value === 0 ? "#64748b" : "#a78bfa"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Units differ by bar (TC $/t, cut %, halted Mt) — read as a response pack, not a common scale.
            Cut and halt slow further concentration; they do not reopen custom-smelter margins outside China.
          </p>
        </ChartCard>
      )}

      {panel === "ledger" && (
        <ChartCard
          title="Full August vintage ledger (|Δ| ranked)"
          subtitle="Filter by stage / direction / sector — price rows in %, smelter fees in $, holds at 0 pp"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={ledgerBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      name: string;
                      delta: number;
                      unit: string;
                    };
                    const label =
                      d.unit === "pct"
                        ? fmtPct(d.delta)
                        : d.unit === "pp"
                          ? `${d.delta > 0 ? "+" : ""}${d.delta} pp`
                          : String(d.delta);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        {d.name}: {label}
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="delta" name="Δ" radius={[0, 4, 4, 0]}>
                  {ledgerBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {buckets.map((b) => (
              <span key={b.id} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: b.color }}
                />
                {b.label}: {b.count}
              </span>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}
