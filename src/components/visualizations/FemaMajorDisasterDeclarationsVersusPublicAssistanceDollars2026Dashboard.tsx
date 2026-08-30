"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANNUAL,
  HEADLINE,
  INCIDENT_MIX,
  SOURCE_NOTE,
  STATE_PA_TOP,
  VIZ_MARKERS,
  filterAnnual,
} from "@/data/fema-major-disaster-declarations-versus-public-assistance-dollars-2026-data";

// viz-types: dual-axis composed (DR bars + PA line), DR×PA scatter,
// stacked incident mix, jurisdiction horizontal bars, spike pie
// | layout: default
// smoke-marker: Declarations vs PA dollars by fiscal year

type ViewId = "dual" | "scatter" | "mix" | "states" | "spike";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const SLATE = "#64748b";
const SKY = "#0284c7";
const VIOLET = "#7c3aed";
const MIX_COLORS = [TEAL, SKY, AMBER, ROSE, VIOLET, SLATE, NAVY];

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function FemaMajorDisasterDeclarationsVersusPublicAssistanceDollars2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [includeBio, setIncludeBio] = useState(true);
  const [fyMin, setFyMin] = useState(2015);
  const [stateMetric, setStateMetric] = useState<"paB" | "nonBioB">("paB");

  const rows = useMemo(
    () => filterAnnual(includeBio, fyMin, 2025),
    [includeBio, fyMin],
  );

  const dualData = useMemo(
    () =>
      rows.map((r) => ({
        fy: `FY${r.fy}`,
        year: r.fy,
        declarations: r.uniqueDrs,
        paB: r.paFederalB,
        paPerDrM: r.paPerDrM,
        noaa: r.noaaBillionCount,
      })),
    [rows],
  );

  const scatterData = useMemo(
    () =>
      rows.map((r) => ({
        x: r.uniqueDrs,
        y: r.paFederalB,
        fy: r.fy,
        z: Math.max(40, Math.min(200, r.paPerDrM / 4)),
      })),
    [rows],
  );

  const mixData = useMemo(() => {
    const fys = [...new Set(INCIDENT_MIX.map((r) => r.fy))].filter(
      (fy) => fy >= fyMin,
    );
    const types = [
      ...new Set(
        INCIDENT_MIX.filter((r) => r.fy >= fyMin).map((r) => r.incidentType),
      ),
    ];
    return fys.map((fy) => {
      const row: Record<string, string | number> = { fy: `FY${fy}` };
      for (const t of types) {
        const hit = INCIDENT_MIX.find(
          (r) => r.fy === fy && r.incidentType === t,
        );
        let v = hit?.uniqueDrs ?? 0;
        if (!includeBio && t === "Biological") v = 0;
        row[t] = v;
      }
      return row;
    });
  }, [fyMin, includeBio]);

  const mixKeys = useMemo(() => {
    const keys = [
      ...new Set(
        INCIDENT_MIX.filter((r) => r.fy >= fyMin).map((r) => r.incidentType),
      ),
    ];
    return includeBio ? keys : keys.filter((k) => k !== "Biological");
  }, [fyMin, includeBio]);

  const stateRows = useMemo(() => {
    const key = stateMetric;
    return [...STATE_PA_TOP]
      .map((s) => ({ name: s.state, value: s[key], bio: s.bioB }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [stateMetric]);

  const spikePie = useMemo(() => {
    const fy2017 = ANNUAL.find((r) => r.fy === 2017)!;
    const fy2020 = ANNUAL.find((r) => r.fy === 2020)!;
    const rest = ANNUAL.filter((r) => r.fy !== 2017 && r.fy !== 2020).reduce(
      (s, r) => s + r.paFederalB,
      0,
    );
    return [
      { name: "FY2017 (Harvey/Irma/Maria era)", value: fy2017.paFederalB, fill: ROSE },
      {
        name: "FY2020 Biological (COVID PA)",
        value: fy2020.bioPaB,
        fill: VIOLET,
      },
      {
        name: "FY2020 non-biological",
        value: fy2020.paNonBioB,
        fill: AMBER,
      },
      { name: "All other FYs in window", value: +rest.toFixed(2), fill: TEAL },
    ];
  }, []);

  return (
    <div
      className="w-full space-y-4"
      data-viz="fema-major-disaster-declarations-versus-public-assistance-dollars-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-slate-900">
          {VIZ_MARKERS[0]} — peak {HEADLINE.peakDrCount} unique major disasters
          in FY{HEADLINE.peakDrFy}; PA spikes to ${HEADLINE.peakPaB}B in
          FY{HEADLINE.peakPaFy} (mostly COVID) and ${HEADLINE.fy2017PaB}B in
          FY2017
        </p>
        <p className="mt-1 text-xs text-slate-500">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          options={[
            { id: "dual", label: "Declarations vs $" },
            { id: "scatter", label: "DR × PA scatter" },
            { id: "mix", label: "Incident mix" },
            { id: "states", label: "Jurisdictions" },
            { id: "spike", label: "Spike share" },
          ]}
          value={view}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={includeBio}
              onChange={(e) => setIncludeBio(e.target.checked)}
              className="rounded border-slate-300"
            />
            Include biological (COVID) DRs / PA
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            From FY
            <select
              value={fyMin}
              onChange={(e) => setFyMin(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
            >
              {[2015, 2016, 2017, 2018, 2019, 2020].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {view === "dual" && (
        <ChartCard
          title="Unique major disaster declarations vs PA dollars"
          subtitle="Bars = unique DR disasterNumbers by fyDeclared. Line = federal PA obligated ($B) for disasters declared that FY."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dualData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Declarations", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{ value: "PA $B", angle: 90, position: "insideRight", style: { fontSize: 11 } }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="declarations" name="Unique DRs" fill={TEAL} radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="paB"
                  name="PA federal $B"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="noaa"
                  name="NOAA $1B+ events (CY)"
                  fill={SKY}
                  stroke={SKY}
                  fillOpacity={0.12}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Do more declarations mean more PA dollars?"
          subtitle="Each point is a fiscal year. Bubble size scales with PA $ per declaration. Spikes sit far above the cluster."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Unique DRs"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Unique major disasters", position: "insideBottom", offset: -2, style: { fontSize: 11 } }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="PA $B"
                  tick={{ fontSize: 11 }}
                  label={{ value: "PA $B", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "x") return [value, "Unique DRs"];
                    if (name === "y") return [`$${value}B`, "PA federal"];
                    return [value, String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { fy?: number } | undefined;
                    return p?.fy ? `FY${p.fy}` : "";
                  }}
                />
                <Scatter data={scatterData} fill={AMBER}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.fy}
                      fill={d.y > 20 ? ROSE : d.y > 8 ? AMBER : TEAL}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "mix" && (
        <ChartCard
          title="What kinds of major disasters were declared?"
          subtitle="Stacked unique DR counts by OpenFEMA incidentType. Severe storms and floods dominate most years; FY2020 Biological is the outlier."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mixData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {mixKeys.map((k, i) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    stackId="mix"
                    fill={MIX_COLORS[i % MIX_COLORS.length]}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "states" && (
        <ChartCard
          title="Where did the decade’s PA dollars concentrate?"
          subtitle="Federal PA obligated for disasters declared FY2015–FY2025, by applicant state/territory. Toggle strips out Biological dollars."
        >
          <div className="mb-3">
            <ToggleGroup
              options={[
                { id: "paB", label: "All PA $" },
                { id: "nonBioB", label: "Non-biological PA $" },
              ]}
              value={stateMetric}
              onChange={setStateMetric}
            />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                layout="vertical"
                data={stateRows}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="B" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [`$${v}B`, "Federal PA"]} />
                <Bar dataKey="value" name="Federal PA $B" radius={[0, 4, 4, 0]}>
                  {stateRows.map((r) => (
                    <Cell
                      key={r.name}
                      fill={r.bio > 5 && stateMetric === "paB" ? VIOLET : TEAL}
                    />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "spike" && (
        <ChartCard
          title="Two fiscal years dominate the decade’s PA dollars"
          subtitle="FY2017 hurricane recovery and FY2020 COVID Public Assistance dwarf every other year in the OpenFEMA summary pull."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spikePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) =>
                      `${String(name).slice(0, 18)}… ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
                    }
                  >
                    {spikePie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${v}B`, "PA federal"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-3 text-sm text-slate-700">
              <p>
                Declarations and dollars do <strong>not</strong> rise together.
                Unique major disasters roughly doubled from FY2015 ({HEADLINE.startDrCount})
                to the FY{HEADLINE.peakDrFy} peak ({HEADLINE.peakDrCount}), but
                federal PA is a fat-tailed series: two declaration years account
                for most of the decade’s obligated dollars in this attribution.
              </p>
              <p>
                Strip biological PA and FY2020 falls to about ${ANNUAL.find((r) => r.fy === 2020)!.paNonBioB}B —
                in line with ordinary storm years, not a second Maria-scale spike.
              </p>
              <p className="text-xs text-slate-500">
                Attribution is by declaration fiscal year, not obligation cash-flow
                year. Later obligations on open projects still accrue to the
                declaration FY of the disaster.
              </p>
            </div>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
