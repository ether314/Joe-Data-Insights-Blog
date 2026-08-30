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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DETAIL_TABLE,
  HEADLINE,
  HOST_CAUSE_SLICES,
  HOST_REPORT_CARD,
  HOST_MINUTES_OTP80_THRESHOLD,
  OTP_STANDARD_PCT,
  QUARTER_TREND,
  SOURCE_NOTE,
  VIZ_MARKERS,
  responsibilityBars,
  scatterPoints,
  type ServiceLineId,
} from "@/data/amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026-data";

// viz-types: host-share vs OTP scatter, responsibility stacked bars,
// Class I host ladder bars, host-cause pie, quarterly dual-axis composed
// | layout: default
// smoke-marker: Host share vs endpoint OTP

type ViewId = "scatter" | "stacks" | "hosts" | "causes" | "trend";
type ServiceFilter = Exclude<ServiceLineId, "nec"> | "all";
type OtpBand = "all" | "pass" | "fail";

const ROSE = "#e11d48";
const SKY = "#0ea5e9";
const AMBER = "#f59e0b";
const SLATE = "#64748b";
const EMERALD = "#059669";
const INDIGO = "#6366f1";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "scatter", label: "Host vs OTP" },
  { id: "stacks", label: "Responsibility" },
  { id: "hosts", label: "Host ladder" },
  { id: "causes", label: "Host causes" },
  { id: "trend", label: "Quarter path" },
];

const SERVICES: { id: ServiceFilter; label: string }[] = [
  { id: "all", label: "LD + State" },
  { id: "long-distance", label: "Long Distance" },
  { id: "state-supported", label: "State Supported" },
];

const OTP_BANDS: { id: OtpBand; label: string }[] = [
  { id: "all", label: "All OTP" },
  { id: "fail", label: "Below 80%" },
  { id: "pass", label: "At/above 80%" },
];

const QUARTERS = ["FY24 Q3", "FY25 Q1", "FY25 Q3"] as const;

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
      <div className="mt-3 h-72 w-full">{children}</div>
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

function Chip({
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
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function AmtrakHostResponsibleDelayMinutesVersusOnTimePerformance2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [service, setService] = useState<ServiceFilter>("all");
  const [otpBand, setOtpBand] = useState<OtpBand>("all");
  const [quarter, setQuarter] = useState<(typeof QUARTERS)[number]>("FY25 Q3");

  const scatter = useMemo(
    () => scatterPoints(service, otpBand),
    [service, otpBand],
  );

  const stacks = useMemo(() => responsibilityBars(quarter), [quarter]);

  const hostLadder = useMemo(
    () =>
      [...HOST_REPORT_CARD]
        .sort((a, b) => b.hostMin10kEst - a.hostMin10kEst)
        .map((h) => ({
          name: h.name,
          hostMin10k: h.hostMin10kEst,
          grade: h.grade,
          rank: h.rank2024,
        })),
    [],
  );

  const causePie = useMemo(
    () =>
      HOST_CAUSE_SLICES.map((c) => ({
        name: c.label,
        value: c.sharePct,
        code: c.code,
        color: c.color,
      })),
    [],
  );

  const trend = useMemo(
    () =>
      QUARTER_TREND.map((q) => ({
        short: q.short,
        ldHostShare: q.ldHostSharePct,
        ssHostShare: q.ssHostSharePct,
        ldOtp: q.ldOtpPct,
        ssOtp: q.ssOtpPct,
        systemOtp: q.systemOtpPct,
      })),
    [],
  );

  const failCount = DETAIL_TABLE.filter((r) => r.customerOtpPct < OTP_STANDARD_PCT).length;

  return (
    <div
      className="space-y-4"
      data-viz="amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
        <p className="text-xs font-medium uppercase tracking-wider text-sky-300">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">
          Hosts take {HEADLINE.ldHostSharePct}% of LD delay minutes — OTP{" "}
          {HEADLINE.ldOtpPct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          {REFERENCE_BLURB}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat
            label="State-supported host share"
            value={`${HEADLINE.ssHostSharePct}%`}
            hint={`${HEADLINE.ssHostMin10k} host min / 10k · OTP ${HEADLINE.ssOtpPct}%`}
          />
          <Stat
            label="LD host minutes / 10k"
            value={String(HEADLINE.ldHostMin10k)}
            hint={`Amtrak slice ${HEADLINE.ldAmtrakMin10k} · total ${HEADLINE.ldTotalMin10k}`}
          />
          <Stat
            label="Routes below 80% OTP"
            value={`${failCount} / ${HEADLINE.routePanelN}`}
            hint={`Panel · ${HEADLINE.quarter}`}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <ControlRow label="View">
          {VIEWS.map((v) => (
            <Chip key={v.id} active={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </Chip>
          ))}
        </ControlRow>
        <ControlRow label="Service">
          {SERVICES.map((s) => (
            <Chip
              key={s.id}
              active={service === s.id}
              onClick={() => setService(s.id)}
            >
              {s.label}
            </Chip>
          ))}
        </ControlRow>
        <ControlRow label="OTP band">
          {OTP_BANDS.map((b) => (
            <Chip
              key={b.id}
              active={otpBand === b.id}
              onClick={() => setOtpBand(b.id)}
            >
              {b.label}
            </Chip>
          ))}
        </ControlRow>
        <ControlRow label="FRA quarter">
          {QUARTERS.map((q) => (
            <Chip key={q} active={quarter === q} onClick={() => setQuarter(q)}>
              {q}
            </Chip>
          ))}
        </ControlRow>
      </div>

      {view === "scatter" ? (
        <ChartCard
          title="Host-responsible minutes vs customer OTP"
          subtitle={`${scatter.length} routes · vertical line = ${HOST_MINUTES_OTP80_THRESHOLD} min/10k rule of thumb · horizontal = ${OTP_STANDARD_PCT}% FRA floor`}
        >
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="hostMin10k"
                name="Host min/10k"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Host-responsible delay min / 10k train-miles",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                  fill: SLATE,
                }}
              />
              <YAxis
                type="number"
                dataKey="otpPct"
                name="OTP"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Customer OTP %",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                  fill: SLATE,
                }}
              />
              <ZAxis range={[60, 160]} />
              <ReferenceLine
                x={HOST_MINUTES_OTP80_THRESHOLD}
                stroke={AMBER}
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={OTP_STANDARD_PCT}
                stroke={EMERALD}
                strokeDasharray="4 4"
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "otpPct" ? `${value}%` : value,
                  name === "otpPct" ? "OTP" : "Host min/10k",
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.route ?? ""
                }
              />
              <Scatter data={scatter} fill={SKY}>
                {scatter.map((p) => (
                  <Cell key={p.id} fill={p.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "stacks" ? (
        <ChartCard
          title={`${VIZ_MARKERS[1]} · ${quarter}`}
          subtitle="Minutes of delay per 10,000 train-miles by FRA responsibility category"
        >
          <ResponsiveContainer>
            <BarChart data={stacks} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="short" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amtrak" name="Amtrak" stackId="a" fill={INDIGO} />
              <Bar dataKey="host" name="Host railroad" stackId="a" fill={ROSE} />
              <Bar
                dataKey="thirdParty"
                name="Third party"
                stackId="a"
                fill={SLATE}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "hosts" ? (
        <ChartCard
          title={VIZ_MARKERS[2]}
          subtitle="CY2024 Amtrak Host Railroad Report Card · desk-estimated host min/10k (higher = worse)"
        >
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={hostLadder}
              margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11 }}
              />
              <ReferenceLine
                x={HOST_MINUTES_OTP80_THRESHOLD}
                stroke={AMBER}
                strokeDasharray="4 4"
              />
              <Tooltip
                formatter={(v, _n, item) => [
                  `${v} min/10k · grade ${item?.payload?.grade ?? ""}`,
                  "Host delay",
                ]}
              />
              <Bar dataKey="hostMin10k" name="Host min/10k" radius={[0, 4, 4, 0]}>
                {hostLadder.map((h) => (
                  <Cell
                    key={h.name}
                    fill={
                      h.hostMin10k <= HOST_MINUTES_OTP80_THRESHOLD
                        ? EMERALD
                        : h.hostMin10k > 1100
                          ? ROSE
                          : AMBER
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "causes" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Host delay cause mix (illustrative)"
            subtitle="FTI-dominant pattern described in FRA Class I Figure 5 notes"
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={causePie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {causePie.map((c) => (
                    <Cell key={c.code} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Why FTI dominates the host ledger
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Freight train interference is a dispatching decision on host
              track — Amtrak waits while freight moves. Amtrak counted about{" "}
              <span className="font-semibold text-slate-900">
                {HEADLINE.ftiDelayMinutes2024.toLocaleString()}
              </span>{" "}
              FTI delay minutes in calendar 2024. Slow orders (DSR) and
              passenger interference (PTI) rotate into the lead on a few hosts
              (notably CPKC / CN-IC in recent FRA notes), but FTI remains the
              system-wide story on Class I territory.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
              {HOST_CAUSE_SLICES.map((c) => (
                <li key={c.id} className="flex justify-between gap-2">
                  <span>
                    <span
                      className="mr-2 inline-block h-2 w-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.code} · {c.label}
                  </span>
                  <span className="font-medium text-slate-700">{c.sharePct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {view === "trend" ? (
        <ChartCard
          title="Host share of delay minutes vs OTP path"
          subtitle="Left axis: host share % of delay stack · Right axis: customer OTP %"
        >
          <ResponsiveContainer>
            <ComposedChart data={trend} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="short" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="share"
                domain={[40, 60]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Host share %",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                  fill: SLATE,
                }}
              />
              <YAxis
                yAxisId="otp"
                orientation="right"
                domain={[40, 90]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "OTP %",
                  angle: 90,
                  position: "insideRight",
                  fontSize: 11,
                  fill: SLATE,
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="share"
                dataKey="ldHostShare"
                name="LD host share %"
                fill={ROSE}
                opacity={0.85}
              />
              <Bar
                yAxisId="share"
                dataKey="ssHostShare"
                name="SS host share %"
                fill={SKY}
                opacity={0.85}
              />
              <Line
                yAxisId="otp"
                type="monotone"
                dataKey="ldOtp"
                name="LD OTP %"
                stroke={ROSE}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="otp"
                type="monotone"
                dataKey="ssOtp"
                name="SS OTP %"
                stroke={SKY}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">{VIZ_MARKERS.join(" · ")}</p>
    </div>
  );
}

const REFERENCE_BLURB =
  `FRA ${HEADLINE.quarter}: Long Distance host railroads account for ${HEADLINE.ldHostSharePct}% of delay minutes per 10k train-miles (${HEADLINE.ldHostMin10k} of ${HEADLINE.ldTotalMin10k}); State Supported hosts hold ${HEADLINE.ssHostSharePct}%. Customer OTP sits at ${HEADLINE.ldOtpPct}% (LD) and ${HEADLINE.ssOtpPct}% (SS) against an 80% federal floor. ${HEADLINE.topHostName} earned the lone ${HEADLINE.topHostGrade} on Amtrak’s 2024 Host Report Card; ${HEADLINE.bottomHostName} closed at ${HEADLINE.bottomHostGrade}.`;

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}
