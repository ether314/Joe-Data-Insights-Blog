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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANNUAL,
  HEADLINE,
  MONTHS,
  QUARTERS,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/streaming-video-cpi-versus-cable-and-satellite-tv-cpi-2026-data";

type Panel =
  | "index-race"
  | "gap-area"
  | "yoy-composed"
  | "annual-ladder"
  | "scatter-pace"
  | "bundle-bars";

type Overlay = "core" | "plus-net" | "plus-all";
type WindowKey = "full" | "divergence" | "catchup";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "index-race": {
    title: "Cable TV vs video subscription/rental indexes (2019 = 100)",
    subtitle: `July 2026: cable ${HEADLINE.cableIdx}, video sub/rental ${HEADLINE.streamIdx} — gap ${HEADLINE.gapPp} pp`,
  },
  "gap-area": {
    title: "Stream − cable gap (percentage points)",
    subtitle: `Trough ${HEADLINE.troughGapPp} pp in ${HEADLINE.troughGapLabel}; ${HEADLINE.closedFromTroughPp} pp closed by ${HEADLINE.latestMonth}`,
  },
  "yoy-composed": {
    title: "Year-over-year percent change",
    subtitle: `Latest: video sub/rental ${HEADLINE.streamYoy}% vs cable ${HEADLINE.cableYoy}%`,
  },
  "annual-ladder": {
    title: "Calendar-year average indexes",
    subtitle: "Cable stayed higher; video sub/rental compressed then rebounded after 2023",
  },
  "scatter-pace": {
    title: "Quarterly cable index vs video sub/rental index",
    subtitle: "Points below the diagonal mean video prices lagged cable on the same 2019 base",
  },
  "bundle-bars": {
    title: "Latest levels vs 2019 (pct change)",
    subtitle: `Cable +${HEADLINE.cablePctSince2019}%, video sub/rental +${HEADLINE.streamPctSince2019}%, internet +${HEADLINE.netPctSince2019}%`,
  },
};

const fmt = (n: number) => n.toFixed(1);

export function StreamingVideoCpiVersusCableAndSatelliteTvCpi2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("index-race");
  const [overlay, setOverlay] = useState<Overlay>("core");
  const [windowKey, setWindowKey] = useState<WindowKey>("full");

  const mData = useMemo(() => {
    if (windowKey === "divergence")
      return MONTHS.filter((r) => r.month >= "2020-01" && r.month <= "2023-12");
    if (windowKey === "catchup") return MONTHS.filter((r) => r.month >= "2023-01");
    return MONTHS;
  }, [windowKey]);

  const qData = useMemo(() => {
    if (windowKey === "divergence")
      return QUARTERS.filter((r) => r.label >= "2020Q01" && r.label <= "2023Q04");
    if (windowKey === "catchup") return QUARTERS.filter((r) => r.label >= "2023Q01");
    return QUARTERS;
  }, [windowKey]);

  const yoyData = useMemo(
    () =>
      mData
        .filter((r) => r.cableYoy != null && r.streamYoy != null)
        .map((r) => ({
          month: r.month,
          cable: r.cableYoy as number,
          stream: r.streamYoy as number,
          net: r.netYoy as number | null,
          all: r.allYoy as number | null,
        })),
    [mData],
  );

  const scatterPts = useMemo(
    () =>
      qData.map((r) => ({
        cable: r.cableIdx,
        stream: r.streamIdx,
        label: r.label,
        gap: r.gapPp,
      })),
    [qData],
  );

  const bundleBars = [
    { id: "cable", label: SERIES_META.cable.short, pct: HEADLINE.cablePctSince2019, color: SERIES_META.cable.color },
    { id: "stream", label: SERIES_META.stream.short, pct: HEADLINE.streamPctSince2019, color: SERIES_META.stream.color },
    { id: "sub", label: SERIES_META.subRent.short, pct: HEADLINE.subPctSince2019, color: SERIES_META.subRent.color },
    { id: "net", label: SERIES_META.internet.short, pct: HEADLINE.netPctSince2019, color: SERIES_META.internet.color },
    { id: "all", label: SERIES_META.allItems.short, pct: HEADLINE.allPctSince2019, color: SERIES_META.allItems.color },
  ];

  const meta = PANEL_META[panel];
  const showNet = overlay === "plus-net" || overlay === "plus-all";
  const showAll = overlay === "plus-all";

  return (
    <div
      data-viz="streaming-video-cpi-versus-cable-and-satellite-tv-cpi-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-amber-950 via-slate-950 to-sky-950/70 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/85">
          Economics · Streaming vs cable TV service indexes
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Streaming vs cable TV service indexes
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Since 2019, cable/satellite/live-streaming TV CPI rose{" "}
          <span className="text-amber-300">{HEADLINE.cablePctSince2019}%</span> while
          purchase/subscription/rental-of-video CPI rose only{" "}
          <span className="text-sky-300">{HEADLINE.streamPctSince2019}%</span>. The
          stream−cable gap bottomed at {HEADLINE.troughGapPp} pp in{" "}
          {HEADLINE.troughGapLabel}, then closed {HEADLINE.closedFromTroughPp} pp to{" "}
          {HEADLINE.gapPp} as of {HEADLINE.latestMonth}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["index-race", "Index race"],
            ["gap-area", "Gap area"],
            ["yoy-composed", "YoY pace"],
            ["annual-ladder", "Annual ladder"],
            ["scatter-pace", "Scatter"],
            ["bundle-bars", "Bundle bars"],
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
        <span className="text-xs font-medium text-slate-500">Overlay</span>
        {(
          [
            ["core", "Cable + video"],
            ["plus-net", "+ Internet"],
            ["plus-all", "+ All items"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOverlay(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              overlay === id
                ? "bg-sky-600 text-white"
                : "bg-slate-900 text-slate-400 ring-1 ring-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Window</span>
        {(
          [
            ["full", "Since 2019"],
            ["divergence", "2020–23 split"],
            ["catchup", "Since 2023"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWindowKey(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              windowKey === id
                ? "bg-slate-100 text-slate-900"
                : "bg-slate-900 text-slate-400 ring-1 ring-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-100">{meta.title}</h4>
        <p className="text-xs text-slate-400">{meta.subtitle}</p>
      </div>

      <div className="h-[360px] px-2 pb-2 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          {panel === "index-race" ? (
            <ComposedChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} minTickGap={28} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="cableIdx" name={SERIES_META.cable.short} stroke={SERIES_META.cable.color} strokeWidth={2.2} dot={false} />
              <Line type="monotone" dataKey="streamIdx" name={SERIES_META.stream.short} stroke={SERIES_META.stream.color} strokeWidth={2.2} dot={false} />
              {showNet && (
                <Line type="monotone" dataKey="netIdx" name={SERIES_META.internet.short} stroke={SERIES_META.internet.color} strokeWidth={1.6} strokeDasharray="5 3" dot={false} />
              )}
              {showAll && (
                <Line type="monotone" dataKey="allIdx" name={SERIES_META.allItems.short} stroke={SERIES_META.allItems.color} strokeWidth={1.4} strokeDasharray="2 2" dot={false} />
              )}
            </ComposedChart>
          ) : panel === "gap-area" ? (
            <AreaChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} minTickGap={28} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }}
                formatter={(v) => `${fmt(Number(v))} pp`}
              />
              <ReferenceLine y={0} stroke="#64748b" />
              <ReferenceLine y={HEADLINE.troughGapPp} stroke="#7f1d1d" strokeDasharray="3 3" label={{ value: "trough", fill: "#fca5a5", fontSize: 10 }} />
              <Area type="monotone" dataKey="gapPp" name="Stream − cable (pp)" stroke="#0369a1" fill="#0369a1" fillOpacity={0.35} />
            </AreaChart>
          ) : panel === "yoy-composed" ? (
            <ComposedChart data={yoyData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} minTickGap={28} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }}
                formatter={(v) => `${fmt(Number(v))}%`}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="cable" name="Cable YoY" fill={SERIES_META.cable.color} opacity={0.85} />
              <Line type="monotone" dataKey="stream" name="Video sub/rental YoY" stroke={SERIES_META.stream.color} strokeWidth={2.2} dot={false} />
              {showNet && (
                <Line type="monotone" dataKey="net" name="Internet YoY" stroke={SERIES_META.internet.color} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              )}
              {showAll && (
                <Line type="monotone" dataKey="all" name="All-items YoY" stroke={SERIES_META.allItems.color} strokeWidth={1.3} strokeDasharray="2 2" dot={false} />
              )}
            </ComposedChart>
          ) : panel === "annual-ladder" ? (
            <BarChart data={ANNUAL} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              <Bar dataKey="cableIdx" name={SERIES_META.cable.short} fill={SERIES_META.cable.color} />
              <Bar dataKey="streamIdx" name={SERIES_META.stream.short} fill={SERIES_META.stream.color} />
              {showNet && <Bar dataKey="netIdx" name={SERIES_META.internet.short} fill={SERIES_META.internet.color} />}
              {showAll && <Bar dataKey="allIdx" name={SERIES_META.allItems.short} fill={SERIES_META.allItems.color} />}
            </BarChart>
          ) : panel === "scatter-pace" ? (
            <ScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey="cable" name="Cable idx" tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <YAxis type="number" dataKey="stream" name="Video idx" tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <ZAxis type="number" dataKey="gap" range={[40, 160]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }}
                formatter={(v, name) => [fmt(Number(v)), String(name)]}
                labelFormatter={(_, payload) => (payload?.[0]?.payload?.label as string) ?? ""}
              />
              <ReferenceLine
                segment={[
                  { x: 85, y: 85 },
                  { x: 135, y: 135 },
                ]}
                stroke="#64748b"
                strokeDasharray="4 4"
              />
              <Scatter name="Quarters" data={scatterPts} fill="#0369a1">
                {scatterPts.map((pt) => (
                  <Cell
                    key={pt.label}
                    fill={pt.gap < -20 ? "#0369a1" : pt.gap < -10 ? "#0ea5e9" : "#f59e0b"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          ) : (
            <BarChart data={bundleBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} unit="%" />
              <YAxis type="category" dataKey="label" width={110} tick={{ fill: "#cbd5e1", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }}
                formatter={(v) => `${fmt(Number(v))}% since 2019`}
              />
              <Bar dataKey="pct" name="% since 2019" radius={[0, 4, 4, 0]}>
                {bundleBars.map((b) => (
                  <Cell key={b.id} fill={b.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <p className="border-t border-slate-800 px-4 py-3 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
