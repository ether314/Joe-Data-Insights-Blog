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
  CLASS_I_HOSTS,
  HEADLINE,
  HOST_CAUSE_STACK,
  HOST_DELAY_OTP_BENCHMARK,
  QUARTERLY_TREND,
  SERVICE_LINES,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterRoutes,
  type HostId,
  type RouteFamilyId,
} from "@/data/amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026-data";

// viz-types: stacked host/Amtrak/third delay, host-vs-OTP scatter,
// Class I cause mix bars, dual-axis OTP slope path
// | layout: default
// smoke-marker: Host vs Amtrak delay stack

type ViewId = "stack" | "scatter" | "causes" | "slope";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#6366f1";
const NAVY = "#1e3a5f";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "stack", label: "Host vs Amtrak delay stack" },
  { id: "scatter", label: "Host minutes vs OTP scatter" },
  { id: "causes", label: "Class I delay-cause mix" },
  { id: "slope", label: "Route OTP slope board" },
];

const FAMILIES: { id: RouteFamilyId | "all"; label: string }[] = [
  { id: "all", label: "All routes" },
  { id: "long-distance", label: "Long Distance" },
  { id: "state-supported", label: "State Supported" },
];

const HOSTS: { id: HostId | "all"; label: string }[] = [
  { id: "all", label: "All hosts" },
  { id: "up", label: "UP" },
  { id: "csx", label: "CSX" },
  { id: "bnsf", label: "BNSF" },
  { id: "cn", label: "CN" },
  { id: "ns", label: "NS" },
  { id: "cpkc", label: "CPKC" },
];

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

export function AmtrakHostResponsibleDelayMinutesVersusOnTimePerformance2026Dashboard() {
  const [view, setView] = useState<ViewId>("stack");
  const [family, setFamily] = useState<RouteFamilyId | "all">("all");
  const [host, setHost] = useState<HostId | "all">("all");

  const stackData = useMemo(
    () =>
      SERVICE_LINES.map((s) => ({
        name: s.label,
        Host: s.hostPer10k,
        Amtrak: s.amtrakPer10k,
        "Third party": s.thirdPartyPer10k,
        hostShare: s.hostSharePct,
        otp: s.customerOtpPct,
      })),
    [],
  );

  const routes = useMemo(
    () => filterRoutes(family, host),
    [family, host],
  );

  const scatterData = useMemo(
    () =>
      routes.map((r) => ({
        name: r.name,
        x: r.hostDelayPer10k,
        y: r.otp2024,
        z: r.family === "long-distance" ? 120 : 80,
        fill: r.family === "long-distance" ? ROSE : TEAL,
        family: r.family,
      })),
    [routes],
  );

  const causeData = useMemo(
    () =>
      HOST_CAUSE_STACK.filter((h) => host === "all" || h.id === host).map(
        (h) => ({
          name: h.shortLabel,
          FTI: h.fti,
          "Slow orders": h.dsr,
          Other: h.other,
        }),
      ),
    [host],
  );

  const slopeData = useMemo(() => {
    const sorted = [...routes].sort((a, b) => b.otp2024 - a.otp2024);
    return sorted.slice(0, 12).map((r) => ({
      name: r.name.length > 16 ? `${r.name.slice(0, 14)}…` : r.name,
      fullName: r.name,
      otp: r.otp2024,
      hostDelay: r.hostDelayPer10k,
      gap: r.hostDelayPer10k - HOST_DELAY_OTP_BENCHMARK,
    }));
  }, [routes]);

  const trendData = useMemo(
    () =>
      QUARTERLY_TREND.map((q) => ({
        label: q.label,
        ldHost: q.ldHostPer10k,
        ssHost: q.ssHostPer10k,
        ldOtp: q.ldOtpPct,
        ssOtp: q.ssOtpPct,
      })),
    [],
  );

  const hostRanks = useMemo(
    () =>
      [...CLASS_I_HOSTS].sort((a, b) => a.rank2024 - b.rank2024).map((h) => ({
        name: h.shortLabel,
        delay: h.delayPer10k,
        grade: h.grade2024,
      })),
    [],
  );

  return (
    <div
      className="space-y-4"
      data-viz="amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Host share of delay minutes vs endpoint OTP
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Hosts take {HEADLINE.ldHostSharePct}% of long-distance delay minutes
            — OTP still {HEADLINE.ldCustomerOtpPct}%
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            FRA FY2025 Q1 books {HEADLINE.ldHostDelayPer10k} host-responsible
            delay minutes per 10k train-miles on Long Distance versus{" "}
            {HEADLINE.ldAmtrakDelayPer10k} Amtrak-responsible. CY2024:{" "}
            {HEADLINE.ldRoutesMeeting80} of {HEADLINE.ldRoutesScored}{" "}
            long-distance routes cleared the 80% customer OTP standard.
          </p>
        </div>
      </div>

      <div className="space-y-2">
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
        <ControlRow label="Service line">
          {FAMILIES.map((f) => (
            <ToggleBtn
              key={f.id}
              active={family === f.id}
              onClick={() => setFamily(f.id)}
            >
              {f.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        <ControlRow label="Host filter">
          {HOSTS.map((h) => (
            <ToggleBtn
              key={h.id}
              active={host === h.id}
              onClick={() => setHost(h.id)}
            >
              {h.label}
            </ToggleBtn>
          ))}
        </ControlRow>
      </div>

      {view === "stack" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={VIZ_MARKERS[0]}
            subtitle="Delay minutes per 10k train-miles by responsibility · FRA FY25 Q1"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Host" stackId="a" fill={ROSE} />
                <Bar dataKey="Amtrak" stackId="a" fill={TEAL} />
                <Bar dataKey="Third party" stackId="a" fill={SLATE} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Host share vs customer OTP"
            subtitle="Same service lines — share of delay minutes vs endpoint OTP"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stackData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  domain={[0, 70]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Host %", angle: -90, position: "insideLeft", style: { fontSize: 10 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[40, 100]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "OTP %", angle: 90, position: "insideRight", style: { fontSize: 10 } }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="hostShare" name="Host share %" fill={AMBER} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="otp"
                  name="Customer OTP %"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <ReferenceLine yAxisId="right" y={80} stroke={INDIGO} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "scatter" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={VIZ_MARKERS[1]}
            subtitle={`Host delay / 10k TM vs CY2024 customer OTP · n=${scatterData.length} · 900 ≈ 80% OTP benchmark`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Host delay"
                  tick={{ fontSize: 11 }}
                  domain={[0, "auto"]}
                  label={{ value: "Host delay min / 10k TM", position: "insideBottom", offset: -2, style: { fontSize: 10 } }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="OTP"
                  tick={{ fontSize: 11 }}
                  domain={[20, 100]}
                  label={{ value: "OTP %", angle: -90, position: "insideLeft", style: { fontSize: 10 } }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.name ?? ""
                  }
                />
                <ReferenceLine
                  x={HOST_DELAY_OTP_BENCHMARK}
                  stroke={INDIGO}
                  strokeDasharray="4 4"
                />
                <ReferenceLine y={80} stroke={INDIGO} strokeDasharray="4 4" />
                <Scatter name="Routes" data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Class I report-card order"
            subtitle="CY2024 Amtrak grades · lower FY25 Q1 host delay is better"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hostRanks}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine x={HOST_DELAY_OTP_BENCHMARK} stroke={INDIGO} strokeDasharray="4 4" />
                <Bar dataKey="delay" name="Host delay / 10k" fill={ROSE} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "causes" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={VIZ_MARKERS[2]}
            subtitle="Freight train interference vs slow orders vs other host codes · FRA FY25 Q1"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={causeData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="FTI" stackId="c" fill={ROSE} />
                <Bar dataKey="Slow orders" stackId="c" fill={AMBER} />
                <Bar dataKey="Other" stackId="c" fill={SLATE} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Quarterly host minutes path"
            subtitle="Long Distance vs State Supported host delay / 10k TM"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[700, 1100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[40, 90]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="ldHost" name="LD host / 10k" fill={ROSE} />
                <Bar yAxisId="left" dataKey="ssHost" name="SS host / 10k" fill={AMBER} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ldOtp"
                  name="LD OTP %"
                  stroke={NAVY}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ssOtp"
                  name="SS OTP %"
                  stroke={TEAL}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "slope" ? (
        <div className="grid gap-4 lg:grid-cols-1">
          <ChartCard
            title={VIZ_MARKERS[3]}
            subtitle="Customer OTP (bars) vs host delay gap to 900-minute benchmark (line) · filtered panel"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={slopeData} margin={{ top: 8, right: 12, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-32}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "OTP %", angle: -90, position: "insideLeft", style: { fontSize: 10 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Gap to 900", angle: 90, position: "insideRight", style: { fontSize: 10 } }}
                />
                <Tooltip
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName ?? ""
                  }
                />
                <Legend />
                <ReferenceLine yAxisId="left" y={80} stroke={INDIGO} strokeDasharray="4 4" />
                <Bar yAxisId="left" dataKey="otp" name="Customer OTP %" fill={TEAL} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gap"
                  name="Host delay − 900"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
