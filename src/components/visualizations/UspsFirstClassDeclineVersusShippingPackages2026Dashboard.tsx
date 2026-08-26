"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
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
  DELTA_BARS,
  HEADLINE,
  INDEX_PATH,
  MIX_PATH,
  REVENUE_MIX_SLICES,
  RPP_PATH,
  SLOPE_ENDPOINTS,
  SOURCE_NOTE,
  YEARLY,
  fmtPct,
  type DeltaBar,
} from "@/data/usps-first-class-decline-versus-shipping-packages-2026-data";

// viz-types: dual-index composed area+line, stacked mix areas,
// diverging delta bars, revenue-mix dual pie, RPP dual-axis line,
// piece-vs-revenue scatter slope
// | layout: default
// smoke-marker: Piece mix vs revenue mix

type ViewId = "indexes" | "mix" | "divergence" | "yield" | "scatter";
type PairFocus = "both" | "first-class" | "shipping";

const SKY = "#0284c8";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const EMERALD = "#059669";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "indexes", label: "Dual indexes" },
  { id: "mix", label: "Piece / revenue mix" },
  { id: "divergence", label: "Divergence" },
  { id: "yield", label: "Rev / piece" },
  { id: "scatter", label: "Scatter" },
];

const FOCUS: { id: PairFocus; label: string }[] = [
  { id: "both", label: "Both categories" },
  { id: "first-class", label: "First-Class only" },
  { id: "shipping", label: "Shipping only" },
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
      className={
        active
          ? "rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white"
          : "rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}

export function UspsFirstClassDeclineVersusShippingPackages2026Dashboard() {
  const [view, setView] = useState<ViewId>("indexes");
  const [focus, setFocus] = useState<PairFocus>("both");
  const [mixMetric, setMixMetric] = useState<"pieces" | "revenue">("revenue");
  const [pieYear, setPieYear] = useState<"2019" | "2025">("2025");

  const indexSeries = useMemo(() => {
    return INDEX_PATH.map((r) => ({
      fy: `FY${r.fy}`,
      fcmPieces: r.fcmPieces,
      fcmRevenue: r.fcmRevenue,
      shipPieces: r.shipPieces,
      shipRevenue: r.shipRevenue,
    }));
  }, []);

  const mixSeries = useMemo(() => {
    return MIX_PATH.map((r) => ({
      fy: `FY${r.fy}`,
      fcm: mixMetric === "pieces" ? r.fcmOfPairPieces : r.fcmOfPairRev,
      ship: mixMetric === "pieces" ? r.shipOfPairPieces : r.shipOfPairRev,
    }));
  }, [mixMetric]);

  const deltaFiltered: DeltaBar[] = useMemo(() => {
    if (focus === "first-class") {
      return DELTA_BARS.filter((d) => d.id.startsWith("fcm"));
    }
    if (focus === "shipping") {
      return DELTA_BARS.filter((d) => d.id.startsWith("ship"));
    }
    return DELTA_BARS.filter((d) => !d.id.startsWith("mkt")).concat(
      DELTA_BARS.filter((d) => d.id.startsWith("mkt")),
    );
  }, [focus]);

  const pieData = useMemo(() => {
    return REVENUE_MIX_SLICES.map((s) => ({
      name: s.name,
      value: pieYear === "2019" ? s.value2019 : s.value2025,
      fill: s.fill,
    }));
  }, [pieYear]);

  const scatterPts = useMemo(() => {
    return YEARLY.map((r) => ({
      fy: r.fy,
      fcmPieceIdx: +(100 * (r.fcmPieces / YEARLY[0].fcmPieces)).toFixed(1),
      fcmRevIdx: +(100 * (r.fcmRevenue / YEARLY[0].fcmRevenue)).toFixed(1),
      shipPieceIdx: +(100 * (r.shipPieces / YEARLY[0].shipPieces)).toFixed(1),
      shipRevIdx: +(100 * (r.shipRevenue / YEARLY[0].shipRevenue)).toFixed(1),
      label: `FY${r.fy}`,
    }));
  }, []);

  const showFcm = focus !== "shipping";
  const showShip = focus !== "first-class";

  return (
    <div
      className="space-y-4"
      data-viz="usps-first-class-decline-versus-shipping-packages-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
          Piece mix vs revenue mix
        </p>
        <p className="mt-1 text-sm text-slate-700">
          Dual index tracks · First-Class pieces at index{" "}
          <span className="font-semibold text-slate-900">
            {HEADLINE.fcmPieceIndex2025}
          </span>{" "}
          while Shipping revenue sits at{" "}
          <span className="font-semibold text-slate-900">
            {HEADLINE.shipRevIndex2025}
          </span>{" "}
          (FY2019=100). Revenue did not follow pieces.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Shipping share of the First-Class + Shipping revenue pair:{" "}
          {HEADLINE.shipRevShare2019}% → {HEADLINE.shipRevShare2025}% · FCM
          pieces {fmtPct(HEADLINE.fcmPieceChangePct)} · Ship revenue{" "}
          {fmtPct(HEADLINE.shipRevChangePct)}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
        <ControlRow label="Focus">
          {FOCUS.map((f) => (
            <ToggleBtn
              key={f.id}
              active={focus === f.id}
              onClick={() => setFocus(f.id)}
            >
              {f.label}
            </ToggleBtn>
          ))}
        </ControlRow>
      </div>

      {view === "indexes" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Dual index tracks"
            subtitle="FY2019 = 100 · pieces vs revenue by category"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={indexSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[70, 150]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Index",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
                {showFcm ? (
                  <Area
                    type="monotone"
                    dataKey="fcmPieces"
                    name="FCM pieces"
                    fill={SKY}
                    fillOpacity={0.15}
                    stroke={SKY}
                    strokeWidth={2}
                  />
                ) : null}
                {showFcm ? (
                  <Line
                    type="monotone"
                    dataKey="fcmRevenue"
                    name="FCM revenue"
                    stroke={INDIGO}
                    strokeWidth={2}
                    dot={false}
                  />
                ) : null}
                {showShip ? (
                  <Area
                    type="monotone"
                    dataKey="shipPieces"
                    name="Ship pieces"
                    fill={AMBER}
                    fillOpacity={0.12}
                    stroke={AMBER}
                    strokeWidth={2}
                  />
                ) : null}
                {showShip ? (
                  <Line
                    type="monotone"
                    dataKey="shipRevenue"
                    name="Ship revenue"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={false}
                  />
                ) : null}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Gap at the endpoint"
            subtitle="FY2025 index − piece index (revenue premium over pieces)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SLOPE_ENDPOINTS.filter((s) =>
                  focus === "both"
                    ? true
                    : focus === "first-class"
                      ? s.category === "first-class"
                      : s.category === "shipping",
                )}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="gapPts" name="Rev − piece index pts" radius={4}>
                  {SLOPE_ENDPOINTS.map((s) => (
                    <Cell
                      key={s.category}
                      fill={s.category === "first-class" ? SKY : AMBER}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "mix" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <ControlRow label="Mix metric">
              <ToggleBtn
                active={mixMetric === "pieces"}
                onClick={() => setMixMetric("pieces")}
              >
                Piece mix
              </ToggleBtn>
              <ToggleBtn
                active={mixMetric === "revenue"}
                onClick={() => setMixMetric("revenue")}
              >
                Revenue mix
              </ToggleBtn>
            </ControlRow>
            <ChartCard
              title={
                mixMetric === "pieces"
                  ? "Piece mix (FCM + Shipping pair)"
                  : "Revenue mix (FCM + Shipping pair)"
              }
              subtitle="100% stacked · Shipping rose in revenue share far more than piece share"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mixSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="fcm"
                    name="First-Class"
                    stackId="1"
                    fill={SKY}
                    stroke={SKY}
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="ship"
                    name="Shipping"
                    stackId="1"
                    fill={AMBER}
                    stroke={AMBER}
                    fillOpacity={0.85}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="space-y-3">
            <ControlRow label="Revenue pie year">
              <ToggleBtn
                active={pieYear === "2019"}
                onClick={() => setPieYear("2019")}
              >
                FY2019
              </ToggleBtn>
              <ToggleBtn
                active={pieYear === "2025"}
                onClick={() => setPieYear("2025")}
              >
                FY2025
              </ToggleBtn>
            </ControlRow>
            <ChartCard
              title={`Operating revenue mix · FY${pieYear}`}
              subtitle="First-Class, Shipping, Marketing, and residual categories"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => {
                      const n = typeof v === "number" ? v : Number(v);
                      return Number.isFinite(n)
                        ? `$${(n / 1000).toFixed(1)}B`
                        : "";
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {view === "divergence" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Revenue did not follow pieces"
            subtitle="% change FY2019 → FY2025 · pieces vs revenue by category"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltaFiltered} margin={{ bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(v) => {
                    const n = typeof v === "number" ? v : Number(v);
                    return Number.isFinite(n) ? fmtPct(n) : "";
                  }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="delta" name="% change" radius={[4, 4, 0, 0]}>
                  {deltaFiltered.map((d) => (
                    <Cell
                      key={d.id}
                      fill={
                        d.delta < 0
                          ? ROSE
                          : d.kind === "revenue"
                            ? EMERALD
                            : AMBER
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Total volume vs package revenue"
            subtitle="System pieces fell while Shipping dollars climbed"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={YEARLY.map((r) => ({
                  fy: `FY${r.fy}`,
                  totalPiecesB: +(r.totalPieces / 1000).toFixed(1),
                  shipRevB: +(r.shipRevenue / 1000).toFixed(2),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Pieces (B)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Ship $B",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 10 },
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  yAxisId="left"
                  dataKey="totalPiecesB"
                  name="Total pieces (B)"
                  fill={SLATE}
                  fillOpacity={0.55}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="shipRevB"
                  name="Shipping revenue ($B)"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "yield" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Revenue per piece"
            subtitle="Price/mix yield · First-Class cents vs Shipping dollars"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={RPP_PATH.map((r) => ({ ...r, fy: `FY${r.fy}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[0.4, 0.7]}
                  label={{
                    value: "FCM $/pc",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[3.5, 5]}
                  label={{
                    value: "Ship $/pc",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 10 },
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {showFcm ? (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="fcmRpp"
                    name="FCM $/piece"
                    stroke={SKY}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ) : null}
                {showShip ? (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="shipRpp"
                    name="Ship $/piece"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ) : null}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Shipping multiple over First-Class"
            subtitle="Ship RPP ÷ FCM RPP · how many letter-dollars in one package"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={RPP_PATH.map((r) => ({ ...r, fy: `FY${r.fy}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[7, 9]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="shipOverFcm"
                  name="Ship ÷ FCM yield"
                  fill={INDIGO}
                  fillOpacity={0.2}
                  stroke={INDIGO}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "scatter" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="First-Class: pieces vs revenue index"
            subtitle="Each point is a fiscal year · departure above the 45° line = revenue outruns pieces"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="fcmPieceIdx"
                  name="Piece index"
                  domain={[70, 110]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Piece index",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 10 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="fcmRevIdx"
                  name="Revenue index"
                  domain={[90, 110]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Rev index",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10 },
                  }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <ReferenceLine
                  segment={[
                    { x: 70, y: 70 },
                    { x: 110, y: 110 },
                  ]}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Scatter
                  name="FCM years"
                  data={scatterPts}
                  fill={SKY}
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Shipping: pieces vs revenue index"
            subtitle="Revenue climbed faster than pieces every year after FY2019"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="shipPieceIdx"
                  name="Piece index"
                  domain={[95, 130]}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="shipRevIdx"
                  name="Revenue index"
                  domain={[95, 150]}
                  tick={{ fontSize: 11 }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <ReferenceLine
                  segment={[
                    { x: 95, y: 95 },
                    { x: 130, y: 130 },
                  ]}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Scatter
                  name="Ship years"
                  data={scatterPts}
                  fill={AMBER}
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
