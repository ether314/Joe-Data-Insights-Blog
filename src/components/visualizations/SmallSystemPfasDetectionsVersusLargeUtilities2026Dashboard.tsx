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
  CONTAMINANT_BY_SIZE,
  DUAL_AXIS,
  EXPOSURE_FRAME,
  HEADLINE,
  MONITORING_DESIGN,
  PANEL_COLORS,
  SIZE_SCATTER,
  SIZE_TIER_MCL,
  SOURCE_NOTE,
  SOURCE_PRESSURE,
  TREATMENT_GAP,
  type SizeTierId,
} from "@/data/small-system-pfas-detections-versus-large-utilities-2026-data";

type Panel =
  | "mcl-by-size"
  | "contaminant-stack"
  | "dual-treatment"
  | "watershed-scatter"
  | "exposure-frame"
  | "treatment-gap";

type SizeFilter = "all" | SizeTierId;

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "mcl-by-size": {
    title: "MCL-exceeding share by system size",
    subtitle:
      "EPA UCMR 5 January 2026 — % of PWSs with ≥1 location average above a PFAS NPDWR MCL",
  },
  "contaminant-stack": {
    title: "Individual PFAS MCL rates by size",
    subtitle:
      "PFOS and PFOA drive the large-system gap; GenX / PFNA remain rare across tiers",
  },
  "dual-treatment": {
    title: "Detection rate vs advanced treatment readiness",
    subtitle:
      "Bars = MCL share (disclosed); line = estimated GAC/IX/RO prevalence — treatment rises with size, but MCL rates rise faster",
  },
  "watershed-scatter": {
    title: "Industrial watershed proxy vs MCL share",
    subtitle:
      "Bubble size ≈ systems with full UCMR results — large utilities sit in the high-pressure, high-rate quadrant",
  },
  "exposure-frame": {
    title: "System counts vs people served",
    subtitle:
      "Large systems are ~45% of this UCMR full-results cut but serve most people — and post the highest MCL rate",
  },
  "treatment-gap": {
    title: "Treatment-gap index by size",
    subtitle:
      "Editorial: MCL share × (1 − advanced-treatment share) — small systems have fewer hits but thinner treatment benches",
  },
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

function tierColor(id: SizeTierId): string {
  return PANEL_COLORS[id];
}

export function SmallSystemPfasDetectionsVersusLargeUtilities2026Dashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("mcl-by-size");
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all");
  const [focusContaminant, setFocusContaminant] = useState<
    "all" | "PFOS" | "PFOA" | "PFHxS"
  >("all");

  const meta = PANEL_META[panel];

  const mclRows = useMemo(() => {
    if (sizeFilter === "all") return SIZE_TIER_MCL;
    return SIZE_TIER_MCL.filter((r) => r.id === sizeFilter);
  }, [sizeFilter]);

  const contaminantChart = useMemo(() => {
    const rows =
      focusContaminant === "all"
        ? CONTAMINANT_BY_SIZE.filter((c) =>
            ["PFOS", "PFOA", "PFHxS"].includes(c.contaminant),
          )
        : CONTAMINANT_BY_SIZE.filter((c) => c.contaminant === focusContaminant);
    return rows.map((c) => ({
      contaminant: c.contaminant,
      Large: c.largeOverPct,
      Medium: c.mediumOverPct,
      Small: c.smallOverPct,
    }));
  }, [focusContaminant]);

  const scatterRows = useMemo(() => {
    if (sizeFilter === "all") return SIZE_SCATTER;
    return SIZE_SCATTER.filter((r) => r.id === sizeFilter);
  }, [sizeFilter]);

  const gapRows = useMemo(() => {
    const base =
      sizeFilter === "all"
        ? TREATMENT_GAP
        : TREATMENT_GAP.filter((r) => r.id === sizeFilter);
    return [...base].sort((a, b) => b.treatmentGapIndex - a.treatmentGapIndex);
  }, [sizeFilter]);

  const dualRows = useMemo(() => {
    if (sizeFilter === "all") return DUAL_AXIS;
    return DUAL_AXIS.filter((r) => r.id === sizeFilter);
  }, [sizeFilter]);

  const exposureRows = useMemo(() => {
    if (sizeFilter === "all") return EXPOSURE_FRAME;
    return EXPOSURE_FRAME.filter((r) => r.id === sizeFilter);
  }, [sizeFilter]);

  return (
    <div
      className={embedded ? "space-y-4" : "space-y-6"}
      data-viz="small-system-pfas-detections-versus-large-utilities-2026"
    >
      <div className="flex flex-wrap gap-2">
        <ControlChip
          active={panel === "mcl-by-size"}
          onClick={() => setPanel("mcl-by-size")}
        >
          MCL by size
        </ControlChip>
        <ControlChip
          active={panel === "contaminant-stack"}
          onClick={() => setPanel("contaminant-stack")}
        >
          Contaminant rates
        </ControlChip>
        <ControlChip
          active={panel === "dual-treatment"}
          onClick={() => setPanel("dual-treatment")}
        >
          Detection vs treatment
        </ControlChip>
        <ControlChip
          active={panel === "watershed-scatter"}
          onClick={() => setPanel("watershed-scatter")}
        >
          Watershed scatter
        </ControlChip>
        <ControlChip
          active={panel === "exposure-frame"}
          onClick={() => setPanel("exposure-frame")}
        >
          People vs systems
        </ControlChip>
        <ControlChip
          active={panel === "treatment-gap"}
          onClick={() => setPanel("treatment-gap")}
        >
          Treatment-gap index
        </ControlChip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Size filter
        </span>
        {(
          [
            ["all", "All sizes"],
            ["small", "Small only"],
            ["medium", "Medium only"],
            ["large", "Large only"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={sizeFilter === id}
            onClick={() => setSizeFilter(id)}
          >
            {label}
          </ControlChip>
        ))}
        {panel === "contaminant-stack" ? (
          <>
            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contaminant
            </span>
            {(
              [
                ["all", "PFOS+PFOA+PFHxS"],
                ["PFOS", "PFOS"],
                ["PFOA", "PFOA"],
                ["PFHxS", "PFHxS"],
              ] as const
            ).map(([id, label]) => (
              <ControlChip
                key={id}
                active={focusContaminant === id}
                onClick={() => setFocusContaminant(id)}
              >
                {label}
              </ControlChip>
            ))}
          </>
        ) : null}
      </div>

      <p className="text-sm text-slate-600">
        Headline: large systems post a{" "}
        <span className="font-semibold text-slate-900">
          {HEADLINE.largeMclSharePct}%
        </span>{" "}
        MCL-exceeding share ({HEADLINE.largeOverMcl.toLocaleString()}/
        {HEADLINE.largeWithFullResults.toLocaleString()}) — about{" "}
        <span className="font-semibold text-slate-900">
          {HEADLINE.largeVsSmallRatio}×
        </span>{" "}
        the small-system sample rate ({HEADLINE.smallMclSharePct}%). Weighted
        national estimate: {HEADLINE.weightedNationalMclSharePct}%.
      </p>

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "mcl-by-size" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={mclRows} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke={PANEL_COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                unit="%"
                domain={[0, 20]}
                label={{
                  value: "% over MCL",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "#64748b" },
                }}
              />
              <Tooltip
                formatter={(value) => [`${Number(value)}%`, "Share over MCL"]}
                labelFormatter={(l) => String(l)}
              />
              <Bar dataKey="mclSharePct" name="% over MCL" radius={[6, 6, 0, 0]}>
                {mclRows.map((r) => (
                  <Cell key={r.id} fill={tierColor(r.id)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "contaminant-stack" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={contaminantChart}
              margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
            >
              <CartesianGrid stroke={PANEL_COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="contaminant" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(value) => `${Number(value)}%`} />
              <Legend />
              <Bar dataKey="Large" fill={PANEL_COLORS.large} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Medium" fill={PANEL_COLORS.medium} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Small" fill={PANEL_COLORS.small} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "dual-treatment" ? (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart
              data={dualRows}
              margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
            >
              <CartesianGrid stroke={PANEL_COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                unit="%"
                domain={[0, 40]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                unit="%"
                domain={[0, 40]}
              />
              <Tooltip formatter={(value) => `${Number(value)}%`} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="mclSharePct"
                name="MCL share (disclosed)"
                fill={PANEL_COLORS.large}
                radius={[6, 6, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="advancedTreatmentSharePct"
                name="Est. GAC/IX/RO share"
                stroke={PANEL_COLORS.treatment}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "watershed-scatter" ? (
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid stroke={PANEL_COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="industrialProxy"
                name="Industrial proxy"
                unit=""
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Industrial watershed proxy (est.)",
                  position: "insideBottom",
                  offset: -4,
                  style: { fontSize: 11, fill: "#64748b" },
                }}
              />
              <YAxis
                type="number"
                dataKey="mclSharePct"
                name="MCL %"
                unit="%"
                domain={[0, 20]}
                tick={{ fontSize: 12 }}
              />
              <ZAxis
                type="number"
                dataKey="systemsWithFullResults"
                range={[120, 520]}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  const n = Number(value);
                  const key = String(name);
                  if (key === "mclSharePct") return [`${n}%`, "MCL share"];
                  if (key === "industrialProxy") return [n, "Industrial proxy"];
                  return [n, key];
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label
                    ? String(payload[0].payload.label)
                    : ""
                }
              />
              <Scatter data={scatterRows} name="Size tier">
                {scatterRows.map((r) => (
                  <Cell key={r.id} fill={tierColor(r.id)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "exposure-frame" ? (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart
              data={exposureRows}
              margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
            >
              <CartesianGrid stroke={PANEL_COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
              <Tooltip formatter={(value) => `${Number(value)}%`} />
              <Legend />
              <Bar
                dataKey="shareOfUcmrSystemsPct"
                name="% of UCMR full-results systems"
                fill={PANEL_COLORS.medium}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="shareOfUsPopServedPct"
                name="% of people served (est.)"
                fill={PANEL_COLORS.small}
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="mclSharePct"
                name="MCL share"
                stroke={PANEL_COLORS.large}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "treatment-gap" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              layout="vertical"
              data={gapRows}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={PANEL_COLORS.grid} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} domain={[0, 12]} />
              <YAxis
                type="category"
                dataKey="label"
                width={130}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [Number(value), "Gap index"]}
                labelFormatter={(l) => String(l)}
              />
              <Bar dataKey="treatmentGapIndex" name="Gap index" radius={[0, 6, 6, 0]}>
                {gapRows.map((r) => (
                  <Cell key={r.id} fill={tierColor(r.id)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </ChartCard>

      <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Monitoring design & source note
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {MONITORING_DESIGN.map((r) => (
            <li key={r.id}>
              <span className="font-medium text-slate-800">{r.label}</span>:{" "}
              {r.design} (~{r.approxUniverse.toLocaleString()} in design). {r.note}
            </li>
          ))}
          {SOURCE_PRESSURE.map((r) => (
            <li key={`src-${r.id}`}>
              {r.label} source mix (est.): {r.surfaceOrMixedSharePct}% surface/mixed,{" "}
              {r.groundwaterSharePct}% groundwater.
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      </details>
    </div>
  );
}
