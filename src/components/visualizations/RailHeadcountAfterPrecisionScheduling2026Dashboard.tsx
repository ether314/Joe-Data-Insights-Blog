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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  ANNUAL_TAPE,
  CARRIER_CUTS,
  CRAFT_SHARES,
  ERA_LABELS,
  ERA_SUMMARIES,
  HEADLINE,
  INFLECTION_SCATTER,
  SOURCE_NOTE,
  type EraId,
  type MetricLens,
} from "@/data/rail-headcount-after-precision-scheduling-2026-data";

type Panel = "tape" | "inflection" | "carriers" | "crafts";

const COLORS = {
  employment: "#0ea5e9",
  dwell: "#f59e0b",
  speed: "#10b981",
  cars: "#8b5cf6",
  pre: "#64748b",
  psr: "#dc2626",
  covid: "#f97316",
  stabilize: "#2563eb",
  muted: "#94a3b8",
};

const ERA_COLOR: Record<EraId, string> = {
  "pre-psr": COLORS.pre,
  "psr-wave": COLORS.psr,
  "covid-shock": COLORS.covid,
  stabilize: COLORS.stabilize,
};

const PIE_COLORS = ["#0ea5e9", "#06b6d4", "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

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

function ControlBtn({
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

export function RailHeadcountAfterPrecisionScheduling2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("tape");
  const [eraFilter, setEraFilter] = useState<EraId | "all">("all");
  const [lens, setLens] = useState<MetricLens>("employment");
  const [minDrop, setMinDrop] = useState<number>(20);

  const tapeFiltered = useMemo(() => {
    if (eraFilter === "all") return ANNUAL_TAPE;
    return ANNUAL_TAPE.filter((r) => r.era === eraFilter);
  }, [eraFilter]);

  const scatterFiltered = useMemo(() => {
    if (eraFilter === "all") return INFLECTION_SCATTER;
    return INFLECTION_SCATTER.filter((p) => p.era === eraFilter);
  }, [eraFilter]);

  const carrierBars = useMemo(
    () =>
      [...CARRIER_CUTS]
        .filter((c) => c.empShare2026Pct > 0 && Math.abs(c.empChangePct) >= minDrop)
        .sort((a, b) => a.empChangePct - b.empChangePct)
        .map((c) => ({
          ...c,
          dropAbs: Math.abs(c.empChangePct),
        })),
    [minDrop],
  );

  const sharePie = useMemo(
    () =>
      CARRIER_CUTS.filter((c) => c.empShare2026Pct > 0).map((c) => ({
        name: c.label,
        value: c.empShare2026Pct,
      })),
    [],
  );

  const craftStacked = useMemo(
    () =>
      (["share2015Pct", "share2022Pct", "share2026Pct"] as const).map((key, i) => {
        const year = [2015, 2022, 2026][i];
        const row: Record<string, string | number> = { year: String(year) };
        for (const c of CRAFT_SHARES) {
          row[c.craft] = c[key];
        }
        return row;
      }),
    [],
  );

  const lensLabel =
    lens === "employment" ? "Employment (000s)" : lens === "dwell" ? "Dwell (hours)" : "Speed (mph)";

  return (
    <div
      className="w-full space-y-4"
      data-viz="rail-headcount-after-precision-scheduling-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Headcount vs dwell inflection
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          STB employment · AAR dwell / speed
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-200">
          Class I employment fell{" "}
          <span className="font-semibold text-white">{HEADLINE.employmentDropPct}%</span> from the{" "}
          {HEADLINE.employmentPeakYear} peak ({HEADLINE.employmentPeakK}k) to the{" "}
          {HEADLINE.employmentTroughYear} trough ({HEADLINE.employmentTroughK}k). Average terminal
          dwell rose first — up {HEADLINE.dwellRiseHours}h by 2019 — about{" "}
          {HEADLINE.dwellLeadYears} years before the employment trough.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Panel</span>
        {(
          [
            ["tape", "Dual tape"],
            ["inflection", "Inflection scatter"],
            ["carriers", "Carrier cuts"],
            ["crafts", "Craft mix"],
          ] as const
        ).map(([id, label]) => (
          <ControlBtn key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </ControlBtn>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Era</span>
        <ControlBtn active={eraFilter === "all"} onClick={() => setEraFilter("all")}>
          All eras
        </ControlBtn>
        {(Object.keys(ERA_LABELS) as EraId[]).map((e) => (
          <ControlBtn key={e} active={eraFilter === e} onClick={() => setEraFilter(e)}>
            {ERA_LABELS[e]}
          </ControlBtn>
        ))}
      </div>

      {panel === "tape" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Highlight lens
            </span>
            {(
              [
                ["employment", "Employment"],
                ["dwell", "Dwell"],
                ["speed", "Speed"],
              ] as const
            ).map(([id, label]) => (
              <ControlBtn key={id} active={lens === id} onClick={() => setLens(id)}>
                {label}
              </ControlBtn>
            ))}
          </div>

          <ChartCard
            title="Employment falls after dwell rises"
            subtitle="Left axis: Class I headcount (000s). Right axis: terminal dwell (hours) and train speed (mph)."
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={tapeFiltered} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="emp"
                    tick={{ fontSize: 12 }}
                    domain={[110, 170]}
                    label={{ value: "Emp (000s)", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="svc"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    domain={[20, 30]}
                    label={{ value: "Dwell / mph", angle: 90, position: "insideRight", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                    formatter={(value, name) => [
                      typeof value === "number" ? value.toFixed(1) : String(value ?? ""),
                      String(name ?? ""),
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="emp"
                    type="monotone"
                    dataKey="employmentK"
                    name="Employment (000s)"
                    fill={COLORS.employment}
                    fillOpacity={lens === "employment" ? 0.35 : 0.12}
                    stroke={COLORS.employment}
                    strokeWidth={lens === "employment" ? 3 : 1.5}
                  />
                  <Line
                    yAxisId="svc"
                    type="monotone"
                    dataKey="dwellHours"
                    name="Dwell (hours)"
                    stroke={COLORS.dwell}
                    strokeWidth={lens === "dwell" ? 3 : 1.5}
                    dot={{ r: lens === "dwell" ? 4 : 2 }}
                  />
                  <Line
                    yAxisId="svc"
                    type="monotone"
                    dataKey="speedMph"
                    name="Speed (mph)"
                    stroke={COLORS.speed}
                    strokeWidth={lens === "speed" ? 3 : 1.5}
                    strokeDasharray={lens === "speed" ? undefined : "4 4"}
                    dot={{ r: lens === "speed" ? 4 : 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Active lens: {lensLabel}. Dwell peaked in 2019 ({HEADLINE.dwellPeakHours}h); employment
              troughed in {HEADLINE.employmentTroughYear}.
            </p>
          </ChartCard>

          <ChartCard
            title="Era averages: thinner crews, stickier yards"
            subtitle="Mean employment, dwell, and speed by PSR era window."
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ERA_SUMMARIES} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }} />
                  <Legend />
                  <Bar dataKey="avgEmpK" name="Avg emp (000s)" fill={COLORS.employment} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgDwellHours" name="Avg dwell (h)" fill={COLORS.dwell} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgSpeedMph" name="Avg speed (mph)" fill={COLORS.speed} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "inflection" ? (
        <div className="space-y-4">
          <ChartCard
            title="Did dwell move first?"
            subtitle="Each point is a year: X = YoY employment change (%), Y = YoY dwell change (hours). PSR-wave years sit in the lower-right."
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="empYoYPct"
                    name="Emp YoY %"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Employment YoY (%)", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="dwellYoYHours"
                    name="Dwell YoY h"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Dwell YoY (hours)", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                    formatter={(value, name) => [
                      typeof value === "number" ? value.toFixed(1) : String(value ?? ""),
                      String(name ?? ""),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ? String(payload[0].payload.label) : ""
                    }
                  />
                  <Scatter data={scatterFiltered} name="Year">
                    {scatterFiltered.map((p) => (
                      <Cell key={p.year} fill={ERA_COLOR[p.era]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
              {(Object.keys(ERA_LABELS) as EraId[]).map((e) => (
                <span key={e} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ERA_COLOR[e] }}
                  />
                  {ERA_LABELS[e]}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Pre-COVID emp↔dwell correlation ≈ {ANALYTICS.empDwellCorrPreCovid}; post-COVID ≈{" "}
              {ANALYTICS.empDwellCorrPostCovid}. First large dwell jump: {ANALYTICS.firstDwellStressYear}.
            </p>
          </ChartCard>
        </div>
      ) : null}

      {panel === "carriers" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Min |Δ employment| 2015→2022
            </span>
            {[15, 20, 25, 30].map((n) => (
              <ControlBtn key={n} active={minDrop === n} onClick={() => setMinDrop(n)}>
                ≥{n}%
              </ControlBtn>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Carrier employment cuts"
              subtitle="2015→2022 Class I headcount change (%) vs dwell stress in the PSR window."
            >
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={carrierBars}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} domain={[-40, 0]} />
                    <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                      formatter={(value, name) => [
                        `${value}%`,
                        name === "empChangePct" ? "Emp Δ 2015–22" : String(name ?? ""),
                      ]}
                    />
                    <Bar dataKey="empChangePct" name="Emp Δ %" radius={[0, 4, 4, 0]}>
                      {carrierBars.map((c) => (
                        <Cell
                          key={c.id}
                          fill={c.dwellDeltaHours >= 4 ? COLORS.psr : COLORS.employment}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Red bars: dwell rose ≥4h in the 2015→2019 window. Filter shows {carrierBars.length}{" "}
                carriers.
              </p>
            </ChartCard>

            <ChartCard
              title="Mid-2026 employment share"
              subtitle="Approximate Class I headcount mix among surviving reporting entities."
            >
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sharePie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {sharePie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                      formatter={(value) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {panel === "crafts" ? (
        <div className="space-y-4">
          <ChartCard
            title="Craft mix under thinner payrolls"
            subtitle="Share of Class I employment by craft — 2015 peak, 2022 trough, mid-2026."
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={craftStacked} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }} />
                  <Legend />
                  {CRAFT_SHARES.map((c, i) => (
                    <Area
                      key={c.craft}
                      type="monotone"
                      dataKey={c.craft}
                      stackId="1"
                      stroke={PIE_COLORS[i % PIE_COLORS.length]}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                      fillOpacity={0.75}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Yard/terminal share down ~{ANALYTICS.yardShareLossPp} pp (2015→2022); professional/other
              up ~{ANALYTICS.professionalGainPp} pp as PSR closed humps and centralized planning.
            </p>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
