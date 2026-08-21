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
  LineChart,
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
  CET_FIELDS,
  FLOW_SIGNALS,
  HEADLINE,
  HHI_BY_LENS,
  INTENSITY_PATH,
  KTI_SPLITS,
  PATENT_LEDGERS,
  SCOREBOARD,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_SLOPE,
  VOLUME_IMPACT,
  curveFor,
  fmtHhi,
  fmtPct,
  fmtTn,
  ladderFor,
  type PerimeterId,
} from "@/data/measurement-science-concentration-202608-data";

// viz-types: HHI bars, Top-1/Top-3 grouped bars, Lorenz area+line, ladder bars, intensity multi-line, flow dumbbell bars, CET field bars, patent-ledger bars, KTI split bars, volume×impact scatter, Top-3 donut | layout: default

type ViewId = "scoreboard" | "ladder" | "flow" | "patents";
type LadderMetric = "sharePct" | "cumulativePct";
type SlopeMetric = "gerdTop1Pct" | "gapPp" | "cetAiTop1Pct";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
const SLATE = "#94a3b8";
const TEAL = "#14b8a6";

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
                : "bg-transparent text-slate-700 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MeasurementScienceConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [perimeter, setPerimeter] = useState<PerimeterId>("gerd");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [slopeMetric, setSlopeMetric] = useState<SlopeMetric>("gapPp");

  const ladder = useMemo(() => {
    const rows = [...ladderFor(perimeter)];
    if (ladderMetric === "sharePct") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.cumulativePct - a.cumulativePct);
  }, [perimeter, ladderMetric]);

  const curve = useMemo(() => curveFor(perimeter), [perimeter]);

  const hhiBars = useMemo(
    () => [...HHI_BY_LENS].sort((a, b) => b.hhi - a.hhi),
    [],
  );

  const scoreboardBars = useMemo(
    () =>
      SCOREBOARD.map((r) => ({
        ...r,
        short: r.label
          .replace(" (PPP)", "")
          .replace(" priority patents", "")
          .replace(" applicants", "")
          .replace(" ledger", "")
          .replace(" volume", ""),
      })),
    [],
  );

  const donut = useMemo(() => {
    const rows = ladderFor(perimeter).filter((r) => r.id !== "row");
    const top = rows.slice(0, 3);
    const rest = 100 - top.reduce((s, r) => s + r.sharePct, 0);
    return [
      ...top.map((r) => ({ name: r.short, value: r.sharePct, color: r.color })),
      {
        name: "RoW",
        value: Math.max(0, rest),
        color: SLATE,
      },
    ];
  }, [perimeter]);

  const intensityLine = useMemo(
    () =>
      INTENSITY_PATH.map((r) => ({
        year: r.year,
        china: r.chinaPct,
        us: r.usPct,
        gap: r.gapPp,
      })),
    [],
  );

  const flowBars = useMemo(
    () =>
      FLOW_SIGNALS.map((r) => ({
        ...r,
        priorVal: r.prior,
        neuVal: r.value,
      })),
    [],
  );

  const ktiGrouped = useMemo(
    () =>
      KTI_SPLITS.map((r) => ({
        short: r.short,
        US: r.usSharePct,
        China: r.chinaSharePct,
      })),
    [],
  );

  const scatter = useMemo(
    () =>
      VOLUME_IMPACT.map((r) => ({
        ...r,
        x: r.pubSharePct,
        y: r.hcaRatePct,
        z: Math.max(40, (r.gerdSharePct ?? 4) * 6),
      })),
    [],
  );

  const cetSorted = useMemo(
    () => [...CET_FIELDS].sort((a, b) => b.chinaSharePct - a.chinaSharePct),
    [],
  );

  const perimeterLabel =
    SCOREBOARD.find((s) => s.id === perimeter)?.label ?? perimeter;

  return (
    <div
      className="space-y-6"
      data-viz="measurement-science-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Measurement & science — August 2026 concentration lens
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          GERD top-1 {fmtPct(HEADLINE.gerdTop1Pct)} China · top-3{" "}
          {fmtPct(HEADLINE.gerdTop3Pct)} · CET AI{" "}
          {fmtPct(HEADLINE.cetAiTop1Pct, 0)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Carried PPP knife-edge (gap {HEADLINE.gerdGapPp} pp) meets the first
          post-2024 China flow year ({fmtTn(HEADLINE.china2025GerdTnYuan)}, +
          {HEADLINE.china2025YoyPct}%) and NSF Translation patent extremes.
          USPTO applicants still US-led at {fmtPct(HEADLINE.usptoUsApplicantSharePct, 0)}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              US+China GERD
            </p>
            <p className="text-lg font-bold">{fmtPct(HEADLINE.gerdUsChinaPct)}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              China ¥ flow YoY
            </p>
            <p className="text-lg font-bold">+{HEADLINE.china2025YoyPct}%</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Intensity gap
            </p>
            <p className="text-lg font-bold">{HEADLINE.intensityGapPp} pp</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              KTI top-1 (US)
            </p>
            <p className="text-lg font-bold">{fmtPct(HEADLINE.ktiTop1Pct, 0)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "scoreboard", label: "HHI / scoreboard" },
            { id: "ladder", label: "Ladder + Lorenz" },
            { id: "flow", label: "Flow + intensity" },
            { id: "patents", label: "Patents + KTI" },
          ]}
          onChange={setView}
        />
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI by concentration lens"
            subtitle="Analytical Herfindahl on stated buckets. Non-OECD and CET AI dominate; USPTO is milder."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hhiBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtHhi(Number(v)), "HHI"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="hhi" radius={[0, 4, 4, 0]}>
                    {hhiBars.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 vs Top-3 scoreboard"
            subtitle="Six perimeters — funding, pubs, CET, USPTO, KTI, and non-OECD."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreboardBars}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="top1Pct" name="Top-1" fill={ROSE} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top3Pct" name="Top-3" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Vintage slope — Top-1 / gap / CET"
            subtitle="Research → 2026 conc → Q3 → Aug. PPP Top-1 and gap freeze after Q3; CET AI stays extreme."
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={slopeMetric}
                options={[
                  { id: "gapPp", label: "China–US gap (pp)" },
                  { id: "gerdTop1Pct", label: "GERD Top-1 %" },
                  { id: "cetAiTop1Pct", label: "CET AI Top-1 %" },
                ]}
                onChange={setSlopeMetric}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={VINTAGE_SLOPE}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey={slopeMetric}
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: ROSE }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Volume × impact scatter"
            subtitle="Publication share vs highly-cited-article rate. Bubble size ≈ GERD share."
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Pubs %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="HCA %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ fontSize: 12 }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Scatter data={scatter}>
                    {scatter.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup
              label="Perimeter"
              value={perimeter}
              options={SCOREBOARD.map((s) => ({
                id: s.id,
                label: s.label
                  .replace(" (PPP)", "")
                  .replace(" priority patents", "")
                  .replace(" applicants", "")
                  .replace(" ledger", "")
                  .replace(" volume", ""),
              }))}
              onChange={setPerimeter}
            />
            <ToggleGroup
              label="Ladder"
              value={ladderMetric}
              options={[
                { id: "sharePct", label: "Share %" },
                { id: "cumulativePct", label: "Cumulative %" },
              ]}
              onChange={setLadderMetric}
            />
            <button
              type="button"
              onClick={() => setShowEqualLine((v) => !v)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                showEqualLine
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              Equal-share line
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title={`${perimeterLabel} — share ladder`}
              subtitle="Ranked market shares. Toggle cumulative to read Top-k concentration directly."
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ladder}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      unit="%"
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={72}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [fmtPct(Number(v)), ladderMetric === "sharePct" ? "Share" : "Cumulative"]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey={ladderMetric}
                      radius={[0, 4, 4, 0]}
                    >
                      {ladder.map((r) => (
                        <Cell key={r.id} fill={r.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Lorenz-style concentration curve"
              subtitle="Cumulative share vs equal-share reference. Steeper = more concentrated."
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={curve}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      unit="%"
                      domain={[0, 100]}
                    />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="sharePct"
                      fill={ROSE}
                      fillOpacity={0.15}
                      stroke={ROSE}
                      strokeWidth={2.5}
                      name="Cumulative share"
                    />
                    {showEqualLine && (
                      <Line
                        type="monotone"
                        dataKey="equalPct"
                        stroke={SLATE}
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={false}
                        name="Equal share"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Top-3 vs rest donut"
              subtitle={`Selected perimeter: ${perimeterLabel}`}
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donut}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {donut.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [fmtPct(Number(v)), "Share"]}
                      contentStyle={{ fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
                {donut.map((d) => (
                  <span key={d.name} className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    {d.name} {fmtPct(d.value, d.value >= 10 ? 0 : 1)}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "flow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="China 2025 domestic flow signals"
            subtitle="Yuan ledger — tempo and composition, not world PPP shares. Do not splice into GERD Top-1."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={flowBars}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="priorVal" name="Prior" fill={SLATE} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neuVal" name="2025 / Aug" fill={ROSE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Intensity path — China closing, US still Top-1"
            subtitle="Domestic China intensity vs carried US ~3.4%. Gap narrows to ~0.6 pp by 2025."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={intensityLine}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[2, 4]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    unit=" pp"
                    domain={[0, 1.2]}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="china"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    name="China intensity"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="us"
                    stroke={SKY}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    connectNulls={false}
                    name="US intensity"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gap"
                    stroke={AMBER}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                    name="Gap (pp)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "patents" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CET field concentration — China volume share"
            subtitle="AI is the extreme (~75%). Every field still shows US citation-lead notes in the data."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cetSorted}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 0), "China share"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="chinaSharePct" radius={[0, 4, 4, 0]}>
                    {cetSorted.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Patent ledger disagreement"
            subtitle="CET volume Top-1 is China; USPTO utility applicants still US-led (~47%)."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PATENT_LEDGERS}
                  margin={{ top: 8, right: 12, left: 0, bottom: 32 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="top1Pct" name="Top-1 %" radius={[4, 4, 0, 0]}>
                    {PATENT_LEDGERS.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="KTI split — total vs mfg tip vs services"
            subtitle="US keeps aggregate Top-1 via services; China concentrates manufacturing VA."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ktiGrouped}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 50]} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="US" fill={SKY} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="China" fill={ROSE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Patent ledger HHI"
            subtitle="Continuous cousin of Top-1 — CET AI is extreme; USPTO is oligopoly-class."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PATENT_LEDGERS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtHhi(Number(v)), "HHI"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="hhi" radius={[0, 4, 4, 0]}>
                    {PATENT_LEDGERS.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Sources & caveats</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel={s.url.startsWith("http") ? "noreferrer" : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
