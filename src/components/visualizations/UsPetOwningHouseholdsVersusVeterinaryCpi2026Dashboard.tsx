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
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
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
  CPI_ANNUAL,
  HEADLINE,
  OTHER_SPECIES_2025,
  OWNERSHIP_AVMA,
  SPECIES_2025,
  SOURCE_NOTE,
  cpiWithBase,
  ownershipForFrame,
  type IndexBase,
  type OwnershipFrame,
  type SpeciesFocus,
} from "@/data/us-pet-owning-households-versus-veterinary-cpi-2026-data";

type Panel =
  | "cpi-race"
  | "gap-fill"
  | "ownership-waves"
  | "species-radar"
  | "yoy-bars"
  | "price-scatter";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "cpi-race": {
    title: "Veterinary CPI versus all-items CPI",
    subtitle: `By ${HEADLINE.latestCpiYear}, vet services sit at ${HEADLINE.vetIndex1997_2025} on a 1997=100 scale while all-items print ${HEADLINE.allIndex1997_2025}`,
  },
  "gap-fill": {
    title: "How far veterinary CPI outruns all-items",
    subtitle: `Gap of ${HEADLINE.gap1997base2025} index points in ${HEADLINE.latestCpiYear} (1997 = 100)`,
  },
  "ownership-waves": {
    title: "Household ownership shares over survey waves",
    subtitle: `AVMA ${HEADLINE.latestOwnershipYear}: dogs ${HEADLINE.dogHhShare2025}% · cats ${HEADLINE.catHhShare2025}% · any pet ${HEADLINE.anyPetHhShare2025}%`,
  },
  "species-radar": {
    title: "Companion-species footprint (2025 AVMA)",
    subtitle: "Dog and cat dominate; other species share the radar at household-percent scale",
  },
  "yoy-bars": {
    title: "Year-over-year inflation: vet vs all-items",
    subtitle: "2022–2023 vet YoY peaks near 9%; all-items cooled sooner",
  },
  "price-scatter": {
    title: "Dog ownership share vs veterinary CPI index",
    subtitle: "Sparse AVMA waves plotted against same-year vet index (1997 = 100)",
  },
};

const COLORS = {
  vet: "#f59e0b",
  all: "#38bdf8",
  dog: "#fb923c",
  cat: "#a78bfa",
  gap: "#f97316",
  muted: "#64748b",
};

export function UsPetOwningHouseholdsVersusVeterinaryCpi2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [base, setBase] = useState<IndexBase>(ANALYTICS.defaultBase);
  const [frame, setFrame] = useState<OwnershipFrame>(ANALYTICS.defaultFrame);
  const [species, setSpecies] = useState<SpeciesFocus>("both");

  const race = useMemo(() => cpiWithBase(base), [base]);
  const ownership = useMemo(() => ownershipForFrame(frame), [frame]);

  const ownershipLines = useMemo(() => {
    return ownership.map((w) => ({
      year: w.year,
      dog: w.dogShare,
      cat: w.catShare,
      any: w.anyPetShare,
    }));
  }, [ownership]);

  const yoyBars = useMemo(
    () =>
      CPI_ANNUAL.filter((r) => r.year >= 2010 && r.vetYoyPct != null).map(
        (r) => ({
          year: String(r.year),
          vet: r.vetYoyPct!,
          all: r.allYoyPct!,
        }),
      ),
    [],
  );

  const radarRows = useMemo(() => {
    const core = SPECIES_2025.map((s) => ({
      species: s.species,
      hhShare: s.hhShare,
    }));
    const other = OTHER_SPECIES_2025.map((s) => ({
      species: s.species,
      hhShare: s.hhShare,
    }));
    return [...core, ...other];
  }, []);

  const scatterPts = useMemo(() => {
    const byYear = new Map(CPI_ANNUAL.map((r) => [r.year, r.vetIdx1997]));
    return OWNERSHIP_AVMA.filter(
      (w) => w.dogShare != null && byYear.has(w.year),
    ).map((w) => ({
      dogShare: w.dogShare!,
      vetIdx: byYear.get(w.year)!,
      year: w.year,
      catShare: w.catShare ?? 0,
    }));
  }, []);

  const showDog = species !== "cat";
  const showCat = species !== "dog";
  const meta = PANEL_META[panel];
  const baseLabel = base === "1997" ? "1997 = 100" : "2019 = 100";

  return (
    <div
      data-viz="us-pet-owning-households-versus-veterinary-cpi-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-amber-950 via-slate-950 to-sky-950/50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/80">
          Economics · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Pet-owning households vs veterinary CPI
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          AVMA puts dogs in{" "}
          <span className="text-amber-300">{HEADLINE.dogHhShare2025}%</span> of
          households and cats in{" "}
          <span className="text-violet-300">{HEADLINE.catHhShare2025}%</span> —
          while veterinarian-services CPI has climbed to{" "}
          <span className="text-amber-200">
            {HEADLINE.vetMultiple1997to2025}×
          </span>{" "}
          its 1997 level versus ~{HEADLINE.allMultiple1997to2025}× for all-items.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["cpi-race", "CPI race"],
            ["gap-fill", "Outrun gap"],
            ["ownership-waves", "Ownership waves"],
            ["species-radar", "Species radar"],
            ["yoy-bars", "YoY inflation"],
            ["price-scatter", "Share vs price"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-2.5 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Index base</span>
        {(
          [
            ["1997", "1997 = 100"],
            ["2019", "2019 = 100"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setBase(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              base === id
                ? "bg-sky-500/90 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">
          Ownership frame
        </span>
        {(
          [
            ["avma", "AVMA"],
            ["appa", "APPA"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFrame(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              frame === id
                ? "bg-violet-500/90 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Species</span>
        {(
          [
            ["both", "Dog + cat"],
            ["dog", "Dogs"],
            ["cat", "Cats"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSpecies(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              species === id
                ? "bg-orange-500/90 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-100">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-400">
          {meta.subtitle}
          {panel === "cpi-race" || panel === "gap-fill"
            ? ` · viewing ${baseLabel}`
            : ""}
        </p>
      </div>

      <div className="h-[360px] px-2 pb-4 sm:px-4">
        {panel === "cpi-race" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={race} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="gap"
                name="Vet − all-items gap"
                fill={COLORS.gap}
                fillOpacity={0.12}
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="vet"
                name="Veterinarian services"
                stroke={COLORS.vet}
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="all"
                name="All-items CPI"
                stroke={COLORS.all}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-fill" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={race} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="gap"
                name="Index-point gap"
                stroke={COLORS.gap}
                fill={COLORS.gap}
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "ownership-waves" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={ownershipLines}
              margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                unit="%"
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
              <Legend />
              {showDog && (
                <Line
                  type="monotone"
                  dataKey="dog"
                  name="Dog HH %"
                  stroke={COLORS.dog}
                  strokeWidth={2.5}
                  connectNulls
                />
              )}
              {showCat && (
                <Line
                  type="monotone"
                  dataKey="cat"
                  name="Cat HH %"
                  stroke={COLORS.cat}
                  strokeWidth={2.5}
                  connectNulls
                />
              )}
              <Line
                type="monotone"
                dataKey="any"
                name="Any pet HH %"
                stroke={COLORS.muted}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {panel === "species-radar" && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarRows} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="species"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Radar
                name="HH share %"
                dataKey="hhShare"
                stroke={COLORS.vet}
                fill={COLORS.vet}
                fillOpacity={0.35}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {panel === "yoy-bars" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yoyBars} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="vet" name="Vet CPI YoY" fill={COLORS.vet} />
              <Bar dataKey="all" name="All-items YoY" fill={COLORS.all} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "price-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="dogShare"
                name="Dog HH %"
                unit="%"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <YAxis
                type="number"
                dataKey="vetIdx"
                name="Vet CPI"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="catShare" range={[60, 220]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(value, name) => {
                  const n = typeof value === "number" ? value : Number(value);
                  const key = String(name);
                  const label =
                    key === "vetIdx"
                      ? "Vet index"
                      : key === "dogShare"
                        ? "Dog HH %"
                        : "Cat HH %";
                  const display =
                    key === "vetIdx"
                      ? Number.isFinite(n)
                        ? n.toFixed(1)
                        : String(value)
                      : `${n}%`;
                  return [display, label];
                }}
                labelFormatter={(_, payload) => {
                  const year = payload?.[0]?.payload?.year;
                  return year != null ? `Survey year ${year}` : "";
                }}
              />
              <Scatter name="AVMA waves" data={scatterPts} fill={COLORS.dog}>
                {scatterPts.map((p) => (
                  <Cell key={p.year} fill={COLORS.dog} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="border-t border-slate-800 px-4 py-3 sm:px-6">
        <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      </div>
    </div>
  );
}
