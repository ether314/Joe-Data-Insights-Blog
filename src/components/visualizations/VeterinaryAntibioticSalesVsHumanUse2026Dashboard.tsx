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
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ABSOLUTE_TONNAGE,
  ANALYTICS,
  DUAL_AXIS_EU,
  EU_PCU_TREND,
  HEADLINE,
  INTENSITY_LADDER,
  METRIC_EXPLAINERS,
  SOURCE_NOTE,
  US_SALES_TREND,
  US_SPECIES_SHARE,
} from "@/data/veterinary-antibiotic-sales-vs-human-use-2026-data";

type Panel = "tonnage" | "intensity" | "eu-scatter" | "trends" | "species";
type TonnageScope = "majors" | "eu-only";
type TrendFocus = "eu-pcu" | "us-sales" | "both";

const COLORS = {
  animal: "#0f766e",
  human: "#b45309",
  accent: "#1e3a5f",
  muted: "#94a3b8",
  china: "#dc2626",
  us: "#2563eb",
  eu: "#059669",
  estimated: "#a8a29e",
  pie: ["#0f766e", "#1e3a5f", "#b45309", "#0369a1", "#7c3aed"],
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

function ControlChip({
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

export function VeterinaryAntibioticSalesVsHumanUse2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("tonnage");
  const [tonnageScope, setTonnageScope] = useState<TonnageScope>("majors");
  const [trendFocus, setTrendFocus] = useState<TrendFocus>("both");
  const [highlightEstimated, setHighlightEstimated] = useState(true);

  const tonnageData = useMemo(() => {
    const rows =
      tonnageScope === "majors"
        ? ABSOLUTE_TONNAGE
        : ABSOLUTE_TONNAGE.filter((r) => r.id === "eu27");
    return [...rows].sort((a, b) => b.tonnes - a.tonnes);
  }, [tonnageScope]);

  const intensityMgKg = useMemo(
    () => INTENSITY_LADDER.filter((r) => r.unit === "mg/kg" || r.unit === "mg/PCU"),
    [],
  );

  const radarData = useMemo(
    () =>
      DUAL_AXIS_EU.slice(0, 6).map((r) => ({
        label: r.label,
        animalMgPerKg: r.animalMgPerKg,
        humanDddScaled: r.humanDdd * 4,
        humanDdd: r.humanDdd,
      })),
    [],
  );

  return (
    <div className="w-full space-y-4" data-viz="veterinary-antibiotic-sales-vs-human-use-2026">
      <div className="rounded-xl border border-teal-800/20 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/80">
          Metric clash · mg/PCU vs DDD
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
          JIACRA IV: EU/EEA humans at {HEADLINE.jiacraHumanMgPerKg} mg/kg biomass vs animals at{" "}
          {HEADLINE.jiacraAnimalMgPerKg} — animals ~{ANALYTICS.jiacraAnimalBelowHumanPct}% lower on
          the shared ruler, while China alone still clears ~{ANALYTICS.chinaShareOfMulchandaniPct}% of
          modelled global livestock tonnes.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          US FDA medically important livestock sales: {HEADLINE.us2023MedicallyImportantTonnes.toLocaleString()}{" "}
          t (2023). EU Farm-to-Fork tracker: {HEADLINE.eu2023MgPcu} mg/PCU (2023) vs{" "}
          {HEADLINE.eu2030TargetMgPcu} target.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["tonnage", "Absolute tonnes"],
            ["intensity", "Intensity ladder"],
            ["eu-scatter", "EU animal × human"],
            ["trends", "EU PCU & US path"],
            ["species", "US species mix"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </ControlChip>
        ))}
      </div>

      {panel === "tonnage" ? (
        <ChartCard
          title="Livestock antimicrobial mass in large producers"
          subtitle="Years differ by source — compare ranks, not a single census year. Estimated bars are Mulchandani-modelled."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <ControlChip
              active={tonnageScope === "majors"}
              onClick={() => setTonnageScope("majors")}
            >
              Global majors + EU
            </ControlChip>
            <ControlChip
              active={tonnageScope === "eu-only"}
              onClick={() => setTonnageScope("eu-only")}
            >
              EU-27 only
            </ControlChip>
            <ControlChip
              active={highlightEstimated}
              onClick={() => setHighlightEstimated((v) => !v)}
            >
              {highlightEstimated ? "Dim estimates on" : "Dim estimates off"}
            </ControlChip>
          </div>
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tonnageData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} unit=" t" />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fill: "#334155", fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="tonnes" name="Tonnes" radius={[0, 4, 4, 0]}>
                  {tonnageData.map((row) => (
                    <Cell
                      key={row.id}
                      fill={
                        row.confidence === "estimated" && highlightEstimated
                          ? COLORS.estimated
                          : row.id === "china"
                            ? COLORS.china
                            : row.id === "united_states"
                              ? COLORS.us
                              : row.id === "eu27"
                                ? COLORS.eu
                                : COLORS.animal
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "intensity" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Same story, different rulers"
            subtitle="mg/kg and mg/PCU on one axis; DDD lives on another planet — shown in the table below."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={intensityMgKg}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={150}
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name="Intensity" radius={[0, 4, 4, 0]}>
                    {intensityMgKg.map((row) => (
                      <Cell
                        key={row.id}
                        fill={row.sector === "human" ? COLORS.human : COLORS.animal}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="What each metric actually measures" subtitle="Read before ranking countries.">
            <ul className="space-y-3 text-sm text-slate-700">
              {METRIC_EXPLAINERS.map((m) => (
                <li key={m.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">
                    {m.metric}{" "}
                    <span className="font-normal text-slate-500">· {m.sector}</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-slate-500">Counts:</span> {m.whatItCounts}
                  </p>
                  <p>
                    <span className="text-slate-500">÷</span> {m.denominator}
                  </p>
                  <p className="mt-1 text-amber-800">
                    <span className="font-medium">Trap:</span> {m.trap}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              ESAC-Net EU 2023 total: {HEADLINE.esacNet2023Ddd} DDD / 1 000 inhabitants / day — not
              plotted with mg/kg bars.
            </p>
          </ChartCard>
        </div>
      ) : null}

      {panel === "eu-scatter" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="EU countries: animal mg/kg vs human DDD"
            subtitle="Bubble size ∝ veterinary tonnes (ESUAvet 2023). Axes deliberately use different units."
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, bottom: 12, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="animalMgPerKg"
                    name="Animal mg/kg"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Animal sales (mg/kg biomass)",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="humanDdd"
                    name="Human DDD"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Human J01 (DDD/1000/day)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="animalTonnes" range={[60, 400]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="EU countries" data={DUAL_AXIS_EU} fill={COLORS.accent}>
                    {DUAL_AXIS_EU.map((row) => (
                      <Cell key={row.id} fill={COLORS.animal} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Radar: animal intensity vs scaled human DDD"
            subtitle="Human DDD ×4 so both series share a readable radar radius — illustrative only."
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="label" tick={{ fill: "#475569", fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar
                    name="Animal mg/kg"
                    dataKey="animalMgPerKg"
                    stroke={COLORS.animal}
                    fill={COLORS.animal}
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Human DDD ×4"
                    dataKey="humanDddScaled"
                    stroke={COLORS.human}
                    fill={COLORS.human}
                    fillOpacity={0.2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "trends" ? (
        <ChartCard
          title="EU Farm-to-Fork mg/PCU vs US medically important sales"
          subtitle="Left axis: EU mg/PCU. Right axis: US tonnes. Not a causal link — two stewardship clocks."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {(
              [
                ["both", "Both series"],
                ["eu-pcu", "EU mg/PCU only"],
                ["us-sales", "US tonnes only"],
              ] as const
            ).map(([id, label]) => (
              <ControlChip key={id} active={trendFocus === id} onClick={() => setTrendFocus(id)}>
                {label}
              </ControlChip>
            ))}
          </div>
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[2015, 2024]}
                  ticks={[2015, 2017, 2019, 2021, 2023]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  allowDuplicatedCategory={false}
                />
                <YAxis
                  yAxisId="eu"
                  tick={{ fill: COLORS.eu, fontSize: 11 }}
                  label={{
                    value: "EU mg/PCU",
                    angle: -90,
                    position: "insideLeft",
                    fill: COLORS.eu,
                    fontSize: 11,
                  }}
                  hide={trendFocus === "us-sales"}
                />
                <YAxis
                  yAxisId="us"
                  orientation="right"
                  tick={{ fill: COLORS.us, fontSize: 11 }}
                  label={{
                    value: "US tonnes",
                    angle: 90,
                    position: "insideRight",
                    fill: COLORS.us,
                    fontSize: 11,
                  }}
                  hide={trendFocus === "eu-pcu"}
                />
                <Tooltip />
                <Legend />
                {trendFocus !== "us-sales" ? (
                  <Line
                    yAxisId="eu"
                    data={EU_PCU_TREND}
                    type="monotone"
                    dataKey="mgPcu"
                    name="EU mg/PCU"
                    stroke={COLORS.eu}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ) : null}
                {trendFocus !== "eu-pcu" ? (
                  <Line
                    yAxisId="us"
                    data={US_SALES_TREND}
                    type="monotone"
                    dataKey="medicallyImportantTonnes"
                    name="US MI tonnes"
                    stroke={COLORS.us}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ) : null}
                {trendFocus !== "us-sales" ? (
                  <Line
                    yAxisId="eu"
                    data={[
                      { year: 2018, mgPcu: HEADLINE.eu2018RefMgPcu },
                      { year: 2030, mgPcu: HEADLINE.eu2030TargetMgPcu },
                    ]}
                    type="monotone"
                    dataKey="mgPcu"
                    name="F2F 2030 path"
                    stroke={COLORS.muted}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                ) : null}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "species" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="US medically important sales by species (2023)"
            subtitle="FDA CVM species attribution — swine and cattle dominate mass."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={US_SPECIES_SHARE}
                    dataKey="sharePct"
                    nameKey="species"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={(props) => {
                      const name = String(props.name ?? "");
                      const value = Number(props.value ?? 0);
                      return `${name} ${value}%`;
                    }}
                  >
                    {US_SPECIES_SHARE.map((row, i) => (
                      <Cell key={row.species} fill={COLORS.pie[i % COLORS.pie.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Readout" subtitle="What the dashboard will not do">
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>
                It will not convert ESAC-Net DDD into livestock-equivalent tonnes without a full ATC
                mass bridge.
              </li>
              <li>
                It will not treat Mulchandani Brazil/India/Australia bars as audited customs receipts.
              </li>
              <li>
                It will not equate ESUAvet mg/kg with ESVAC mg/PCU after the 2023 methodology break.
              </li>
              <li>
                WOAH 2022 reported ~{HEADLINE.woah2022ReportedTonnes.toLocaleString()} t (adjusted up
                to ~{HEADLINE.woah2022AdjustedTonnes.toLocaleString()} t); coverage is still incomplete.
              </li>
            </ul>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
