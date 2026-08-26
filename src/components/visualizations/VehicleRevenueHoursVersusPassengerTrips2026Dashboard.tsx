"use client";

import { useMemo, useState } from "react";
import {
  Area,
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
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AGENCIES,
  HEADLINE,
  MODE_GAPS,
  NATIONAL_SERIES,
  QUARTERLY_PATH,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterAgencies,
  type RegionId,
  type SizeBandId,
} from "@/data/vehicle-revenue-hours-versus-passenger-trips-2026-data";

// viz-types: dual-axis VRH vs UPT composed, trips-per-VRH area path,
// mode productivity scatter, agency service-load slope dumbbells
// | layout: default
// smoke-marker: VRH vs UPT dual recovery

type ViewId = "dual" | "productivity" | "modes" | "agencies";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#6366f1";
const EMERALD = "#059669";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "dual", label: "VRH vs UPT dual recovery" },
  { id: "productivity", label: "Trips-per-VRH index path" },
  { id: "modes", label: "Mode productivity scatter" },
  { id: "agencies", label: "Agency service-load slope" },
];

const REGIONS: { id: RegionId; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

const SIZES: { id: SizeBandId | "all"; label: string }[] = [
  { id: "all", label: "All sizes" },
  { id: "mega", label: "Mega" },
  { id: "large", label: "Large" },
  { id: "mid", label: "Mid" },
];

const MODE_COLORS: Record<string, string> = {
  bus: TEAL,
  "heavy-rail": ROSE,
  "light-rail": AMBER,
  "commuter-rail": INDIGO,
  "demand-response": EMERALD,
  ferry: SLATE,
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className="mt-3 h-80 w-full">{children}</div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ToggleBtn({
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
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function VehicleRevenueHoursVersusPassengerTrips2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [region, setRegion] = useState<RegionId>("all");
  const [sizeBand, setSizeBand] = useState<SizeBandId | "all">("all");

  const nationalDual = useMemo(
    () =>
      NATIONAL_SERIES.map((r) => ({
        year: String(r.year),
        vrh: r.vrhIndex,
        upt: r.uptIndex,
        gap: r.vrhIndex - r.uptIndex,
      })),
    [],
  );

  const productivityPath = useMemo(
    () =>
      QUARTERLY_PATH.map((p) => ({
        label: p.label,
        tripsPerVrh: p.tripsPerVrhIndex,
        vrh: p.vrhIndex,
        upt: p.uptIndex,
      })),
    [],
  );

  const modeScatter = useMemo(
    () =>
      MODE_GAPS.map((m) => ({
        ...m,
        x: m.vrhIndex,
        y: m.uptIndex,
        fill: MODE_COLORS[m.id] ?? SLATE,
      })),
    [],
  );

  const agencyRows = useMemo(
    () => filterAgencies(region, sizeBand, null),
    [region, sizeBand],
  );

  const slopeData = useMemo(
    () =>
      agencyRows.slice(0, 12).map((a) => ({
        name: a.shortName,
        vrh: a.vrhIndex,
        upt: a.uptIndex,
        lead: a.serviceLeadPts,
        tpr: a.tripsPerVrhIndex,
      })),
    [agencyRows],
  );

  return (
    <div
      className="space-y-4"
      data-viz="vehicle-revenue-hours-versus-passenger-trips-2026"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Service hours vs boardings
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Trips per VRH sit at {HEADLINE.tripsPerVrhIndex2024}% of 2019 while
            hours run near {HEADLINE.vrhIndex2024}%
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            National CY2024 vehicle revenue hours recovered to about{" "}
            {HEADLINE.vrhIndex2024}% of 2019 while unlinked passenger trips
            reached only {HEADLINE.uptIndex2024}%. The {HEADLINE.serviceLeadPts}
            -point service lead leaves trips per VRH near{" "}
            {HEADLINE.tripsPerVrhIndex2024}% of the pre-pandemic load — service
            restored faster than riders in most of the panel.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-teal-50 px-3 py-2">
            <div className="text-lg font-semibold text-teal-800">
              {HEADLINE.vrhIndex2024}
            </div>
            <div className="text-[10px] uppercase text-teal-700">VRH index</div>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <div className="text-lg font-semibold text-amber-800">
              {HEADLINE.uptIndex2024}
            </div>
            <div className="text-[10px] uppercase text-amber-700">UPT index</div>
          </div>
          <div className="rounded-lg bg-rose-50 px-3 py-2">
            <div className="text-lg font-semibold text-rose-800">
              {HEADLINE.tripsPerVrhIndex2024}
            </div>
            <div className="text-[10px] uppercase text-rose-700">
              Trips/VRH
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <ControlRow label="View">
          {VIEWS.map((v) => (
            <ToggleBtn
              key={v.id}
              active={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        {(view === "agencies" || view === "modes") && (
          <>
            <ControlRow label="Region">
              {REGIONS.map((r) => (
                <ToggleBtn
                  key={r.id}
                  active={region === r.id}
                  onClick={() => setRegion(r.id)}
                >
                  {r.label}
                </ToggleBtn>
              ))}
            </ControlRow>
            {view === "agencies" && (
              <ControlRow label="Size band">
                {SIZES.map((s) => (
                  <ToggleBtn
                    key={s.id}
                    active={sizeBand === s.id}
                    onClick={() => setSizeBand(s.id)}
                  >
                    {s.label}
                  </ToggleBtn>
                ))}
              </ControlRow>
            )}
          </>
        )}
      </div>

      {view === "dual" && (
        <ChartCard
          title={VIZ_MARKERS[0]}
          subtitle="National calendar-year indices vs 2019 = 100 — VRH restored ahead of UPT"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={nationalDual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[40, 100]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Index vs 2019",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#64748b" },
                }}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="gap"
                name="Service lead (pts)"
                fill="#fecaca"
                stroke="none"
                fillOpacity={0.45}
              />
              <Line
                type="monotone"
                dataKey="vrh"
                name="VRH index"
                stroke={TEAL}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="upt"
                name="UPT index"
                stroke={AMBER}
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={{ r: 3 }}
              />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "productivity" && (
        <ChartCard
          title={VIZ_MARKERS[1]}
          subtitle="Quarterly desk path — trips per vehicle revenue hour as % of 2019 load"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={productivityPath}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={1} />
              <YAxis domain={[20, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="tripsPerVrh"
                name="Trips / VRH index"
                stroke={ROSE}
                fill="#fda4af"
                fillOpacity={0.35}
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="vrh"
                name="VRH index"
                stroke={TEAL}
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="upt"
                name="UPT index"
                stroke={AMBER}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
              />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "modes" && (
        <ChartCard
          title={VIZ_MARKERS[2]}
          subtitle="CY2024 mode indices — points below the diagonal restored hours faster than trips"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="VRH"
                domain={[85, 100]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "VRH index vs 2019",
                  position: "insideBottom",
                  offset: -12,
                  style: { fontSize: 10, fill: "#64748b" },
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="UPT"
                domain={[60, 100]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "UPT index vs 2019",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#64748b" },
                }}
              />
              <ZAxis range={[120, 280]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <ReferenceLine
                segment={[
                  { x: 85, y: 85 },
                  { x: 100, y: 100 },
                ]}
                stroke="#94a3b8"
                strokeDasharray="4 4"
              />
              <Scatter name="Modes" data={modeScatter}>
                {modeScatter.map((m) => (
                  <Cell key={m.id} fill={m.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-2">
            {modeScatter.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-600"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: m.fill }}
                />
                {m.label} ({m.tripsPerVrhIndex}% trips/VRH)
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "agencies" && (
        <ChartCard
          title={VIZ_MARKERS[3]}
          subtitle={`Top service-lead agencies in filter (${agencyRows.length} of ${AGENCIES.length}) — teal = VRH, amber = UPT`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={slopeData}
              margin={{ top: 4, right: 24, bottom: 4, left: 72 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                domain={[50, 100]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Index vs 2019",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 10, fill: "#64748b" },
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={68}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Legend />
              <ReferenceLine x={100} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line
                dataKey="vrh"
                name="VRH index"
                stroke={TEAL}
                strokeWidth={0}
                dot={{ r: 6, fill: TEAL, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
              <Line
                dataKey="upt"
                name="UPT index"
                stroke={AMBER}
                strokeWidth={0}
                dot={{ r: 6, fill: AMBER, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
