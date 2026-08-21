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
  CONVERTER_FRAMES,
  HEADLINE,
  HHI_BY_LENS,
  SCOREBOARD,
  SECTOR_SPLITS,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_SLOPE,
  VOLUME_IMPACT,
  curveFor,
  fmtBn,
  fmtHhi,
  fmtPct,
  ladderFor,
  type PerimeterId,
} from "@/data/measurement-science-concentration-2026q3-data";

// viz-types: HHI bars, Lorenz area+line, converter bars, vintage multi-line, CET bars, volume×impact scatter, sector bars, donut | layout: default

type ViewId = "hhi" | "ladder" | "converter" | "vintage";
type LadderMetric = "sharePct" | "cumulativePct";
type SlopeMetric = "chinaPct" | "usChinaPct" | "hhi" | "gapPp";

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

export function MeasurementScienceConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("hhi");
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
          .replace(" ledger", ""),
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

  const perimeterLabel =
    SCOREBOARD.find((s) => s.id === perimeter)?.label ?? perimeter;

  return (
    <div
      className="space-y-6"
      data-viz="measurement-science-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Measurement & science — Q3 2026 concentration lens
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          GERD top-1 {fmtPct(HEADLINE.gerdTop1Pct)} China · top-3{" "}
          {fmtPct(HEADLINE.gerdTop3Pct)} · gap {HEADLINE.gerdGapPp} pp
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          OECD/AAAS restatement of 2024 PPP GERD: knife-edge overtake (0.3 pp)
          while US+China still hold {fmtPct(HEADLINE.gerdUsChinaPct)}. Non-OECD
          ledger top-1 hits {fmtPct(HEADLINE.nonOecdChinaPct)}; CET AI patents{" "}
          {fmtPct(HEADLINE.cetAiTop1Pct, 0)}. Converter frames reverse the
          ranking under alt-PPP / EXR.
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
              Business BERD gap
            </p>
            <p className="text-lg font-bold">
              {fmtBn(HEADLINE.businessBerdGapBn)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Non-OECD top-1
            </p>
            <p className="text-lg font-bold">
              {fmtPct(HEADLINE.nonOecdChinaPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              CET AI top-1
            </p>
            <p className="text-lg font-bold">
              {fmtPct(HEADLINE.cetAiTop1Pct, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "hhi", label: "HHI / scoreboard" },
            { id: "ladder", label: "Ladder + Lorenz" },
            { id: "converter", label: "Converter frames" },
            { id: "vintage", label: "Vintage + impact" },
          ]}
          onChange={setView}
        />
      </div>

      {view === "hhi" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI by concentration lens"
            subtitle="Analytical Herfindahl on stated bucket shares (0–10,000). Non-OECD and CET AI dominate."
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
                    dataKey="label"
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
            subtitle="Five perimeters — funding, pubs, CET, KTI, and the non-OECD ledger."
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
                  <YAxis
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 1),
                      name === "top1Pct" ? "Top-1" : "Top-3",
                    ]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="top1Pct" name="top1Pct" fill={ROSE} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top3Pct" name="top3Pct" fill={SKY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Sector split — who funds the knife-edge"
            subtitle={`Business BERD China lead ${fmtBn(HEADLINE.businessBerdGapBn)} vs US government lead ${fmtBn(HEADLINE.govtUsLeadBn)} (constant 2020 PPP).`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SECTOR_SPLITS}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="B" />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtBn(Number(v)),
                      String(name),
                    ]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="chinaLeadBn"
                    name="China lead"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="usLeadBn"
                    name="US lead"
                    fill={SKY}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CET field China share"
            subtitle="International priority patent families — AI is the volume extreme."
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CET_FIELDS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={48}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 0), "China share"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="chinaSharePct" radius={[0, 4, 4, 0]}>
                    {CET_FIELDS.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <ToggleGroup
              label="Perimeter"
              value={perimeter}
              options={[
                { id: "gerd", label: "GERD" },
                { id: "pubs", label: "Pubs" },
                { id: "cet", label: "CET AI" },
                { id: "kti", label: "KTI" },
                { id: "nonOecd", label: "Non-OECD" },
              ]}
              onChange={setPerimeter}
            />
            <ToggleGroup
              label="Metric"
              value={ladderMetric}
              options={[
                { id: "sharePct", label: "Share" },
                { id: "cumulativePct", label: "Cumulative" },
              ]}
              onChange={setLadderMetric}
            />
            <ToggleGroup
              label="Equal line"
              value={showEqualLine ? "on" : "off"}
              options={[
                { id: "on", label: "Show" },
                { id: "off", label: "Hide" },
              ]}
              onChange={(v) => setShowEqualLine(v === "on")}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title={`${perimeterLabel} — ranked ladder`}
              subtitle={
                ladderMetric === "sharePct"
                  ? "Individual jurisdiction / bloc shares"
                  : "Cumulative share from the top"
              }
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
                      domain={[0, 100]}
                      tick={{ fontSize: 11 }}
                      unit="%"
                    />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={64}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [
                        fmtPct(Number(v), 1),
                        ladderMetric === "sharePct" ? "Share" : "Cumulative",
                      ]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey={
                        ladderMetric === "sharePct"
                          ? "sharePct"
                          : "cumulativePct"
                      }
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
              title="Concentration curve vs equal split"
              subtitle="Lorenz-style cumulative share. Gap above the equal line = top-heavy."
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
                      domain={[0, 100]}
                      tick={{ fontSize: 11 }}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(v, name) => [
                        fmtPct(Number(v), 1),
                        name === "sharePct" ? "Actual" : "Equal split",
                      ]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sharePct"
                      fill={ROSE}
                      fillOpacity={0.15}
                      stroke={ROSE}
                      strokeWidth={2}
                    />
                    {showEqualLine && (
                      <Line
                        type="monotone"
                        dataKey="equalPct"
                        stroke={SLATE}
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Top-3 vs rest donut"
              subtitle={`Perimeter: ${perimeterLabel}`}
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
                      formatter={(v, name) => [fmtPct(Number(v), 1), String(name)]}
                      contentStyle={{ fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
                {donut.map((d) => (
                  <span key={d.name} className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: d.color }}
                    />
                    {d.name} {fmtPct(d.value, 1)}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "converter" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="China GERD as % of US — three converters"
            subtitle="Headline PPP prints a knife-edge overtake; alt-PPP and EXR reverse it."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CONVERTER_FRAMES}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 120]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 0), "China / US"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="chinaVsUsPct" radius={[4, 4, 0, 0]}>
                    {CONVERTER_FRAMES.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              100% = parity with US. Only headline PPP clears the line (
              {fmtPct(HEADLINE.chinaVsUsPppPct, 0)}).
            </p>
          </ChartCard>

          <ChartCard
            title="Does world top-1 stay China?"
            subtitle="Boolean concentration read by converter frame."
          >
            <div className="space-y-3 p-2">
              {CONVERTER_FRAMES.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <span
                    className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ background: f.color }}
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {f.label}:{" "}
                      <span
                        className={
                          f.worldTop1StillChina
                            ? "text-rose-600"
                            : "text-sky-600"
                        }
                      >
                        {f.worldTop1StillChina
                          ? "China top-1"
                          : "US remains ahead"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      China/US {fmtPct(f.chinaVsUsPct, 1)} — {f.concentrationRead}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Business vs government dollar gap"
            subtitle="Net China − US (constant 2020 PPP $B). Business concentration funds the overtake; government still favors the US."
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SECTOR_SPLITS}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [fmtBn(Number(v)), "Net China−US"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="netChinaMinusUsBn" radius={[4, 4, 0, 0]}>
                    {SECTOR_SPLITS.map((r) => (
                      <Cell
                        key={r.id}
                        fill={r.netChinaMinusUsBn > 0 ? ROSE : SKY}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "vintage" && (
        <div className="space-y-4">
          <ToggleGroup
            label="Slope metric"
            value={slopeMetric}
            options={[
              { id: "gapPp", label: "China−US gap (pp)" },
              { id: "chinaPct", label: "China share" },
              { id: "usChinaPct", label: "US+China" },
              { id: "hhi", label: "HHI" },
            ]}
            onChange={setSlopeMetric}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Vintage slope — NSF rounded → Q3 AAAS"
              subtitle="Finer shares shrink the gap from 1.0 pp to 0.3 pp; HHI eases slightly."
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={VINTAGE_SLOPE}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey={slopeMetric}
                      stroke={VIOLET}
                      strokeWidth={3}
                      dot={{ r: 5, fill: VIOLET }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Share restatement detail"
              subtitle="China, US, and combined bloc across the two prints."
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={VINTAGE_SLOPE}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[0, 70]}
                      tick={{ fontSize: 11 }}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(v) => [fmtPct(Number(v), 1), ""]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="chinaPct" name="China" fill={ROSE} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="usPct" name="US" fill={SKY} radius={[4, 4, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="usChinaPct"
                      name="US+China"
                      stroke={TEAL}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Volume × citation impact"
              subtitle="Publication world share (x) vs HCA rate % of own articles (y). Bubble ∝ GERD share."
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Pub share"
                      unit="%"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "Pub world share %",
                        position: "insideBottom",
                        offset: -4,
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="HCA rate"
                      unit="%"
                      tick={{ fontSize: 11 }}
                      domain={[0.5, 2]}
                      label={{
                        value: "HCA rate %",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 11,
                      }}
                    />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(v, name) => [
                        typeof v === "number" ? v.toFixed(1) : v,
                        String(name),
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.name ?? ""
                      }
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Scatter data={scatter}>
                      {scatter.map((r) => (
                        <Cell key={r.id} fill={r.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                China leads volume; US still prints a higher highly-cited article
                rate ({fmtPct(1.7)} vs {fmtPct(1.3)}).
              </p>
            </ChartCard>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Sources & method</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
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
