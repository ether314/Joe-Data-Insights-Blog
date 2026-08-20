"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CONCENTRATION_METERS,
  EU_US_RATIO,
  FUNDING_MIX,
  HEADLINE,
  MEASURE_FRAMES,
  SCOREBOARD,
  SECTOR_GAPS,
  SECTOR_INDEX_GROWTH,
  SHARE_RESTATE,
  SOURCE_NOTE,
  SOURCES,
  fmtBn,
  fmtPct,
  fmtPp,
  rankedGrowth,
} from "@/data/measurement-science-update-2026q3-data";

// viz-types: share restatement dumbbell, measure-frame ladder, sector gap diverging, OECD growth bars, funding donut, EU/US ratio path, scoreboard scatter
// viz-plan: panel + frame/growth controls; vintage delta first; no KPI+bar clone

type Panel =
  | "restate"
  | "frames"
  | "sectors"
  | "growth"
  | "funding"
  | "scoreboard";
type FrameFilter = "all" | "ppp" | "sensitivity";
type GrowthView = "yoy" | "index";

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
                ? "bg-slate-800 text-white"
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

export function MeasurementScienceUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("restate");
  const [frameFilter, setFrameFilter] = useState<FrameFilter>("all");
  const [growthView, setGrowthView] = useState<GrowthView>("yoy");

  const restateData = useMemo(
    () =>
      SHARE_RESTATE.map((r) => ({
        short: r.short,
        prior: r.priorPct,
        neu: r.newPct,
        delta: r.deltaPp,
        fill: r.color,
        label: r.label,
      })),
    [],
  );

  const frameData = useMemo(() => {
    let rows = MEASURE_FRAMES;
    if (frameFilter === "ppp") {
      rows = rows.filter((r) => r.id === "nsf-ppp" || r.id === "oecd-2024-ppp");
    } else if (frameFilter === "sensitivity") {
      rows = rows.filter((r) => r.id === "alt-ppp" || r.id === "exr");
    }
    return rows.map((r) => ({
      short: r.label.length > 22 ? `${r.label.slice(0, 20)}…` : r.label,
      full: r.label,
      ratio: r.chinaVsUsPct,
      overtake: r.overtake ? 1 : 0,
      fill: r.overtake ? "#f43f5e" : "#0ea5e9",
      detail: r.detail,
    }));
  }, [frameFilter]);

  const sectorData = useMemo(
    () =>
      SECTOR_GAPS.map((s) => ({
        short: s.label.length > 18 ? `${s.label.slice(0, 16)}…` : s.label,
        full: s.label,
        gap: s.chinaLeadBn,
        fill: s.color,
        detail: s.detail,
      })),
    [],
  );

  const growthData = useMemo(() => {
    if (growthView === "index") {
      return SECTOR_INDEX_GROWTH.map((s) => ({
        short: s.label.length > 16 ? `${s.label.slice(0, 14)}…` : s.label,
        full: s.label,
        value: s.growthPct,
        fill: s.color,
      }));
    }
    return rankedGrowth().map((g) => ({
      short: g.short,
      full: g.label,
      value: g.growthPct,
      fill: g.color,
    }));
  }, [growthView]);

  const fundingPie = FUNDING_MIX.map((f) => ({
    name: f.label,
    value: f.sharePct,
    fill: f.color,
    dollars: f.dollarsTn,
  }));

  const euUsPath = EU_US_RATIO.map((r) => ({
    year: r.year,
    ppp: r.euVsUsPppPct,
    exr: r.euVsUsExrPct,
  }));

  const scatterPts = SCOREBOARD.map((s, i) => ({
    x: i + 1,
    y: s.leader === "China" ? 1 : 0,
    z: 120,
    label: s.label,
    fill: s.color,
    note: s.q3Note,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="measurement-science-update-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Vintage delta — NSF State of S&E → OECD/AAAS Q3
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          PPP overtake gap narrows to 0.3 pp — and vanishes under EXR / alt-PPP
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Versus our prior print (China <strong>30%</strong> vs US{" "}
          <strong>29%</strong>), AAAS/OECD finer shares print{" "}
          <strong>{HEADLINE.chinaSharePct}%</strong> vs{" "}
          <strong>{HEADLINE.usSharePct}%</strong> (
          {fmtPp(HEADLINE.gapPp)} gap). Business BERD drives China{" "}
          {fmtBn(HEADLINE.businessBerdGapBn)} ahead; government still favors the
          US by {fmtBn(HEADLINE.govtUsLeadBn)}. China is{" "}
          {fmtPct(HEADLINE.chinaNonOecdSharePct, 1)} of non-OECD R&D.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              k: "CN−US share gap",
              v: fmtPp(HEADLINE.gapPp),
              s: `was ${fmtPp(HEADLINE.priorGapPp)}`,
            },
            {
              k: "Business BERD gap",
              v: fmtBn(HEADLINE.businessBerdGapBn),
              s: "CN − US (2020 PPP)",
            },
            {
              k: "EXR China/US",
              v: `~${HEADLINE.chinaVsUsExrPct}%`,
              s: "no overtake",
            },
            {
              k: "Non-OECD = China",
              v: fmtPct(HEADLINE.chinaNonOecdSharePct, 1),
              s: "new concentration meter",
            },
          ].map((m) => (
            <div
              key={m.k}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {m.k}
              </p>
              <p className="text-lg font-bold text-white">{m.v}</p>
              <p className="text-xs text-slate-400">{m.s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "restate", label: "Share restatement" },
            { id: "frames", label: "Measure frames" },
            { id: "sectors", label: "Sector gaps" },
            { id: "growth", label: "OECD growth" },
            { id: "funding", label: "Funding mix" },
            { id: "scoreboard", label: "Scoreboard" },
          ]}
        />
        {panel === "frames" && (
          <ToggleGroup
            label="Frames"
            value={frameFilter}
            onChange={setFrameFilter}
            options={[
              { id: "all", label: "All frames" },
              { id: "ppp", label: "PPP only" },
              { id: "sensitivity", label: "Sensitivity" },
            ]}
          />
        )}
        {panel === "growth" && (
          <ToggleGroup
            label="View"
            value={growthView}
            onChange={setGrowthView}
            options={[
              { id: "yoy", label: "2024 YoY" },
              { id: "index", label: "Since 1992" },
            ]}
          />
        )}
      </div>

      {panel === "restate" && (
        <ChartCard
          title="Share restatement: NSF rounded → AAAS/OECD finer print"
          subtitle="China 30%→29.4%, US 29%→29.1%, duopoly 59%→58.5% — overtake holds by 0.3 pp"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={restateData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[25, 62]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={64}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    name === "prior" ? "Prior (NSF)" : "New (AAAS/OECD)",
                  ]}
                />
                <Bar dataKey="prior" name="prior" barSize={10} fill="#94a3b8" />
                <Bar dataKey="neu" name="neu" barSize={10}>
                  {restateData.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {SHARE_RESTATE.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-slate-800">{r.short}</span>
                <span className="ml-2 text-slate-500">
                  {fmtPct(r.priorPct, 1)} → {fmtPct(r.newPct, 1)} (
                  {fmtPp(r.deltaPp)})
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "frames" && (
        <ChartCard
          title="Same 2024 GERD, four converters — overtake is frame-dependent"
          subtitle="NSF/OECD current PPP ≈102% of US; alt-PPP 90–95%; EXR ~50%"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={frameData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 120]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <ReferenceLine
                  x={100}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  label={{ value: "parity", position: "top", fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, _n, item) => [
                    `${Number(value).toFixed(0)}% of US`,
                    (item?.payload as { full?: string })?.full ?? "China/US",
                  ]}
                />
                <Bar dataKey="ratio" radius={[0, 4, 4, 0]}>
                  {frameData.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Red bars = China ahead of US under that converter; blue = US still
            ahead. OECD warns GDP PPPs are not R&D-specific and can be revised.
          </p>
        </ChartCard>
      )}

      {panel === "sectors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Sector gaps: business vs government (CN − US)"
            subtitle="Private sector flips the total; public ledger still US-led"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <ReferenceLine x={0} stroke="#334155" />
                  <Tooltip
                    formatter={(value) => [
                      fmtBn(Number(value)),
                      "China lead vs US",
                    ]}
                  />
                  <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                    {sectorData.map((d) => (
                      <Cell key={d.full} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Concentration meters (prior → Q3)"
            subtitle="What the newest vintage adds beyond the NSF overtake headline"
          >
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {CONCENTRATION_METERS.map((m) => (
                <div
                  key={m.label}
                  className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{m.label}</p>
                    <p className="text-xs text-slate-500">{m.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-slate-500">
                      {m.prior} → {m.neu}
                    </p>
                    <p className="font-semibold text-slate-900">{m.delta}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "growth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              growthView === "yoy"
                ? "OECD-area real GERD growth, 2024"
                : "OECD funding growth since 1992 (indexed)"
            }
            subtitle={
              growthView === "yoy"
                ? "US +3.4%, EU +0.4%, Germany −0.4%; East Asia peers >5% (AAAS/OECD)"
                : "Business +303%, HE/nonprofit +332%, government only +65%"
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthData}
                  margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      growthView === "index" ? `${v}%` : `${v}%`
                    }
                    tick={{ fontSize: 11 }}
                  />
                  <ReferenceLine y={0} stroke="#334155" />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(1)}%`,
                      growthView === "index" ? "Real growth since 1992" : "2024 YoY",
                    ]}
                    labelFormatter={(_l, items) =>
                      (items?.[0]?.payload as { full?: string })?.full ?? ""
                    }
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {growthData.map((d) => (
                      <Cell key={d.full} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="EU R&D vs United States — PPP and EXR paths"
            subtitle="EU fell from 70%→60% of US on PPP; 57%→43% on exchange rates (2014→2024)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={euUsPath}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[30, 80]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(0)}% of US`,
                      name === "ppp" ? "PPP" : "EXR",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="ppp"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                    name="ppp"
                  />
                  <Line
                    type="monotone"
                    dataKey="exr"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    strokeDasharray="5 4"
                    dot={{ r: 5 }}
                    name="exr"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "funding" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="OECD funding mix — business still ~64%"
            subtitle="Business >$1.45T; government ~23%; GBARD reorienting toward defence"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundingPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {fundingPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const p = item?.payload as {
                        name?: string;
                        dollars?: number | null;
                      };
                      const extra =
                        p?.dollars != null ? ` ($${p.dollars}T)` : "";
                      return [`${Number(value).toFixed(0)}%${extra}`, p?.name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 flex flex-wrap justify-center gap-3 text-xs">
              {fundingPie.map((d) => (
                <li key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.fill }}
                  />
                  {d.name} ({d.value}%)
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard
            title="Where progress is funded — and concentrating"
            subtitle="Non-OECD R&D is 92.3% China; OECD intensity plateaus at 2.7%"
          >
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                  Non-OECD concentration
                </p>
                <p className="mt-1 text-3xl font-bold text-rose-900">
                  {fmtPct(HEADLINE.chinaNonOecdSharePct, 1)}
                </p>
                <p className="text-sm text-rose-800">
                  of non-OECD R&D is China (AAAS on OECD 2024)
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OECD R&D / GDP intensity
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {fmtPct(HEADLINE.oecdIntensityPct, 1)}
                </p>
                <p className="text-sm text-slate-600">
                  Plateau 2020–2024 — growth is composition, not intensity lift
                </p>
              </div>
              <p className="text-sm text-slate-600">
                OECD notes government R&D budgets are declining in several
                members while remaining appropriations reorient toward defence —
                a composition shift the prior NSF share print did not surface.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "scoreboard" && (
        <ChartCard
          title="AAAS scoreboard — China leads dollars, people, papers, patents"
          subtitle="Prior update stressed GERD shares + pubs; Q3 adds FTE and PCT patent leadership"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 16, right: 16, left: 8, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[0.5, 4.5]}
                    ticks={[1, 2, 3, 4]}
                    tickFormatter={(v) =>
                      ["", "GERD", "FTEs", "Papers", "PCT"][v] ?? ""
                    }
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[-0.2, 1.2]}
                    ticks={[0, 1]}
                    tickFormatter={(v) => (v === 1 ? "China #1" : "US #1")}
                    tick={{ fontSize: 11 }}
                    width={64}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 200]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(_v, _n, item) => {
                      const p = item?.payload as {
                        label?: string;
                        note?: string;
                      };
                      return [p?.note ?? "", p?.label ?? ""];
                    }}
                  />
                  <Scatter data={scatterPts}>
                    {scatterPts.map((p) => (
                      <Cell key={p.label} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {SCOREBOARD.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">
                      {s.label}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ background: s.color }}
                    >
                      {s.leader}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Prior: {s.priorNote}
                  </p>
                  <p className="text-xs text-slate-700">Q3: {s.q3Note}</p>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Sources & caveats</p>
        <p className="mt-1 text-amber-900/90">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc text-amber-900/80">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-amber-800">
          Growth rows for Japan/Korea (&gt;5%) are labeled estimated where OECD
          prose grouped “Japan, Korea and Türkiye” without a single disclosed
          point estimate in the release summary.
        </p>
      </div>
    </div>
  );
}
