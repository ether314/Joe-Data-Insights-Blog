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
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  ANALYTICS,
  CARRIER_YIELDS,
  EPOCH_BARS,
  HEADLINE,
  MONTHLY,
  MONTHLY_YOY,
  QUARTERLY,
  SOURCE_NOTE,
} from "@/data/domestic-passenger-yield-versus-load-factor-2026-data";

// viz-types: dual-axis composed, yield-LF scatter, PRASM area, carrier bars, epoch bars, YoY bars
// | layout: default
// smoke-marker: Yield vs load factor

type Panel =
  | "dual-track"
  | "prasm-bridge"
  | "lf-scatter"
  | "carrier-bars"
  | "epoch-bars"
  | "yoy-swings";

type Overlay = "both" | "yield" | "lf";
type Window = "full" | "recovery" | "recent";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "dual-track": {
    title: "Domestic yield (¢/RPM) vs load factor (%)",
    subtitle: `As of ${HEADLINE.latestLabel}, yield is ${HEADLINE.yieldCents}¢ while LF is ${HEADLINE.loadFactorPct}% — yield +${HEADLINE.yieldPctSince2019}% vs 2019`,
  },
  "prasm-bridge": {
    title: "PRASM proxy (yield × load factor ÷ 100)",
    subtitle: `Latest proxy ${HEADLINE.prasmProxyCents}¢/ASM — index ${HEADLINE.prasmIdx} vs 2019 = 100`,
  },
  "lf-scatter": {
    title: "Monthly yield vs load factor scatter",
    subtitle: `Post-2021 correlation r = ${HEADLINE.corrYieldLfPost2021}; full sample r = ${HEADLINE.corrYieldLf}`,
  },
  "carrier-bars": {
    title: "Major-carrier domestic yield: 2019 vs 2026 YTD",
    subtitle: "Form 41 entity yields; load factor shown for 2026 context",
  },
  "epoch-bars": {
    title: "Epoch comparison: yield, LF, and PRASM proxy",
    subtitle: "Collapse, 2022 pricing peak, 2024 LF records, and 2026 YTD",
  },
  "yoy-swings": {
    title: "Year-over-year yield % and LF point change",
    subtitle: "Yield growth persisted even as LF held near 80–87%",
  },
};

const YIELD_COLOR = "#38bdf8";
const LF_COLOR = "#a78bfa";
const PRASM_COLOR = "#34d399";
const AMBER = "#f59e0b";

const fmt = (n: number) => n.toFixed(1);

export function DomesticPassengerYieldVersusLoadFactor2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [overlay, setOverlay] = useState<Overlay>("both");
  const [window, setWindow] = useState<Window>("full");

  const mData = useMemo(() => {
    if (window === "recovery") return MONTHLY.filter((r) => r.label >= "2021-01");
    if (window === "recent") return MONTHLY.filter((r) => r.label >= "2023-01");
    return MONTHLY;
  }, [window]);

  const qData = useMemo(() => {
    if (window === "recovery") return QUARTERLY.filter((r) => r.label >= "2021Q1");
    if (window === "recent") return QUARTERLY.filter((r) => r.label >= "2023Q1");
    return QUARTERLY;
  }, [window]);

  const yoyData = useMemo(() => {
    if (window === "recovery") return MONTHLY_YOY.filter((r) => r.label >= "2021-01");
    if (window === "recent") return MONTHLY_YOY.filter((r) => r.label >= "2023-01");
    return MONTHLY_YOY;
  }, [window]);

  const scatterPts = useMemo(
    () =>
      mData.map((r) => ({
        lf: r.loadFactorPct,
        yield: r.yieldCents,
        label: r.label,
        era: r.year <= 2020 ? "pre-2021" : r.year <= 2022 ? "2021-22" : "2023+",
      })),
    [mData],
  );

  const showYield = overlay !== "lf";
  const showLf = overlay !== "yield";
  const meta = PANEL_META[panel];

  const eraColor = (era: string) =>
    era === "pre-2021" ? "#64748b" : era === "2021-22" ? AMBER : YIELD_COLOR;

  return (
    <div
      data-viz="domestic-passenger-yield-versus-load-factor-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-violet-950 via-slate-950 to-sky-950/50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/80">
          Transport & Logistics · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Cents per mile yield vs domestic load factor, 2019 = 100
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Domestic passenger yield has{" "}
          <span className="text-sky-300">risen</span> to {HEADLINE.yieldCents}¢/RPM
          (+{HEADLINE.yieldPctSince2019}% vs 2019) while load factor stayed near{" "}
          <span className="text-violet-300">record territory</span> — {HEADLINE.loadFactorPct}%
          in {HEADLINE.latestLabel}, down only {Math.abs(HEADLINE.lfPtsSince2019)} pts from
          the 2019 baseline despite the COVID trough.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["dual-track", "Dual track"],
            ["prasm-bridge", "PRASM bridge"],
            ["lf-scatter", "LF scatter"],
            ["carrier-bars", "Carrier bars"],
            ["epoch-bars", "Epoch bars"],
            ["yoy-swings", "YoY swings"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-violet-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-2 sm:px-6">
        <span className="text-xs text-slate-500">Overlay:</span>
        {(["both", "yield", "lf"] as const).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOverlay(o)}
            className={`rounded px-2 py-1 text-xs ${
              overlay === o ? "bg-slate-700 text-slate-100" : "text-slate-400"
            }`}
          >
            {o === "both" ? "Both" : o === "yield" ? "Yield only" : "LF only"}
          </button>
        ))}
        <span className="ml-2 text-xs text-slate-500">Window:</span>
        {(
          [
            ["full", "Full"],
            ["recovery", "Since 2021"],
            ["recent", "Since 2023"],
          ] as const
        ).map(([w, label]) => (
          <button
            key={w}
            type="button"
            onClick={() => setWindow(w)}
            className={`rounded px-2 py-1 text-xs ${
              window === w ? "bg-slate-700 text-slate-100" : "text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-100">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-400">{meta.subtitle}</p>
        <div className="mt-3 h-80 w-full">
          {panel === "dual-track" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mData} margin={{ top: 8, right: 48, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" minTickGap={40} />
                <YAxis yAxisId="yield" tick={{ fill: YIELD_COLOR, fontSize: 10 }} domain={[10, 22]} label={{ value: "¢/RPM", angle: -90, position: "insideLeft", fill: YIELD_COLOR, fontSize: 10 }} />
                <YAxis yAxisId="lf" orientation="right" tick={{ fill: LF_COLOR, fontSize: 10 }} domain={[30, 95]} label={{ value: "LF %", angle: 90, position: "insideRight", fill: LF_COLOR, fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Legend />
                {showYield && (
                  <Line yAxisId="yield" type="monotone" dataKey="yieldCents" name="Yield (¢/RPM)" stroke={YIELD_COLOR} dot={false} strokeWidth={2} />
                )}
                {showLf && (
                  <Line yAxisId="lf" type="monotone" dataKey="loadFactorPct" name="Load factor (%)" stroke={LF_COLOR} dot={false} strokeWidth={2} />
                )}
                <ReferenceLine yAxisId="lf" y={HEADLINE.bases.lf2019} stroke="#475569" strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "prasm-bridge" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: PRASM_COLOR, fontSize: 10 }} domain={[4, 18]} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Area type="monotone" dataKey="prasmProxy" name="PRASM proxy (¢)" stroke={PRASM_COLOR} fill={PRASM_COLOR} fillOpacity={0.25} />
                <ReferenceLine y={12.54} stroke="#475569" strokeDasharray="4 4" label={{ value: "2019", fill: "#64748b", fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {panel === "lf-scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="lf" name="LF %" tick={{ fill: LF_COLOR, fontSize: 10 }} domain={[30, 95]} />
                <YAxis type="number" dataKey="yield" name="Yield ¢" tick={{ fill: YIELD_COLOR, fontSize: 10 }} domain={[10, 22]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Scatter data={scatterPts} name="Months">
                  {scatterPts.map((p, i) => (
                    <Cell key={i} fill={eraColor(p.era)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "carrier-bars" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CARRIER_YIELDS} layout="vertical" margin={{ top: 8, right: 24, left: 64, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[12, 20]} />
                <YAxis type="category" dataKey="carrier" tick={{ fill: "#94a3b8", fontSize: 10 }} width={60} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Legend />
                <Bar dataKey="yield2019" name="2019 yield ¢" fill="#64748b" />
                <Bar dataKey="yield2026" name="2026 YTD yield ¢" fill={YIELD_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "epoch-bars" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EPOCH_BARS} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="epoch" tick={{ fill: "#94a3b8", fontSize: 9 }} angle={-20} textAnchor="end" height={56} />
                <YAxis yAxisId="left" tick={{ fill: YIELD_COLOR, fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: LF_COLOR, fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Legend />
                <Bar yAxisId="left" dataKey="yieldCents" name="Yield ¢" fill={YIELD_COLOR} />
                <Bar yAxisId="right" dataKey="loadFactorPct" name="LF %" fill={LF_COLOR} fillOpacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "yoy-swings" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yoyData} margin={{ top: 8, right: 48, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" minTickGap={40} />
                <YAxis yAxisId="yoy" tick={{ fill: YIELD_COLOR, fontSize: 10 }} />
                <YAxis yAxisId="lfpts" orientation="right" tick={{ fill: LF_COLOR, fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Legend />
                <Bar yAxisId="yoy" dataKey="yieldYoY" name="Yield YoY %" fill={YIELD_COLOR} />
                <Line yAxisId="lfpts" type="monotone" dataKey="lfYoY" name="LF YoY (pts)" stroke={LF_COLOR} dot={false} />
                <ReferenceLine yAxisId="yoy" y={0} stroke="#475569" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <p className="border-t border-slate-800 px-4 py-3 text-[10px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
