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
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  APR_GAP_PATH,
  DEBT_CARRY_MIX,
  HEADLINE,
  LIQUID_CASH_VINTAGE,
  MMF_CORRECTION,
  MMF_WEEKLY_PATH,
  REVOLVING_PATH,
  REVOLVING_VS_NYFED,
  SAVING_RATE_PATH,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_METERS,
  fmtPct,
  fmtPp,
  fmtTn,
  meterDeltasSorted,
} from "@/data/consumer-finance-markets-update-202608-data";

// viz-types: vintage Δ bars, MMF stacked area + correction bars, revolving composed, saving line pending, cash dual bars, APR composed | layout: default
// viz-plan: meter Δ; MMF path/correction; revolving path/bridge; saving confirmation; cash sleeves; sticky APR gap; panel + mmf + revolving controls

type Panel = "meters" | "mmf" | "revolving" | "saving" | "cash" | "rates";
type MmfView = "path" | "correction";
type RevolvingView = "path" | "bridge";

const SAVE = "#14b8a6";
const DEBT = "#0ea5e9";
const STRESS = "#f43f5e";
const MMF = "#a78bfa";
const FUNDS = "#38bdf8";
const GAP = "#fb7185";
const PRIOR = "#94a3b8";
const NEW = "#0f172a";
const RETAIL = "#c4b5fd";

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
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ConsumerFinanceMarketsUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("meters");
  const [mmfView, setMmfView] = useState<MmfView>("correction");
  const [revolvingView, setRevolvingView] = useState<RevolvingView>("path");

  const meterRows = useMemo(
    () =>
      meterDeltasSorted().map((m) => ({
        ...m,
        fill: m.direction === "down" ? SAVE : m.direction === "up" ? STRESS : PRIOR,
      })),
    [],
  );

  const cashRows = useMemo(() => {
    return LIQUID_CASH_VINTAGE.map((r) => ({
      name: r.label
        .replace(" (ex-large time, est.)", "")
        .replace(" (ICI)", "")
        .replace(" sleeve", ""),
      prior: r.priorTn,
      neu: r.newTn,
      delta: r.newTn - r.priorTn,
      yieldPct: r.yieldPct,
    }));
  }, []);

  const mmfStack = useMemo(
    () =>
      MMF_WEEKLY_PATH.map((d) => ({
        label: d.label,
        retail: d.retailTn,
        institutional: d.institutionalTn,
        total: d.totalTn,
      })),
    [],
  );

  const correctionBars = useMemo(
    () =>
      MMF_CORRECTION.map((r) => ({
        label: r.label,
        totalTn: r.totalTn,
        fill: r.fill === "prior" ? PRIOR : MMF,
      })),
    [],
  );

  const debtShare = useMemo(
    () =>
      DEBT_CARRY_MIX.map((d) => ({
        name: d.shortLabel,
        tn: d.tn,
        share: d.sharePct,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="consumer-finance-markets-update-202608">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
          Aug 202608 vintage · vs Q3 theme print
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          Official MMF {fmtTn(HEADLINE.mmfNewTn, 2)} (
          {HEADLINE.mmfDeltaTn < 0 ? "−" : "+"}$
          {Math.abs(HEADLINE.mmfDeltaTn * 1000).toFixed(0)}B vs Q3 $8.02T) · G.19 revolving{" "}
          {fmtTn(HEADLINE.revolvingNewTn, 3)} · APR gap ~{HEADLINE.aprGapNewPp.toFixed(1)} pp
        </p>
        <p className="mt-2 text-sm text-slate-300">
          ICI {HEADLINE.newAsOfMmf} · G.19 {HEADLINE.newAsOfRevolving} · Saving{" "}
          {HEADLINE.newAsOfSaving}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "meters", label: "Δ meters" },
            { id: "mmf", label: "MMF" },
            { id: "revolving", label: "Revolving" },
            { id: "saving", label: "Saving" },
            { id: "cash", label: "Cash" },
            { id: "rates", label: "APR gap" },
          ]}
        />
        {panel === "mmf" && (
          <ToggleGroup
            label="MMF view"
            value={mmfView}
            onChange={setMmfView}
            options={[
              { id: "correction", label: "Q3 vs official" },
              { id: "path", label: "Weekly path" },
            ]}
          />
        )}
        {panel === "revolving" && (
          <ToggleGroup
            label="Revolving view"
            value={revolvingView}
            onChange={setRevolvingView}
            options={[
              { id: "path", label: "G.19 path" },
              { id: "bridge", label: "vs NY Fed cards" },
            ]}
          />
        )}
      </div>

      {panel === "meters" && (
        <ChartCard
          title="What changed vs the Q3 theme print"
          subtitle="Signed vintage deltas — ICI restatement and G.19 June revolving lead"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meterRows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={168} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [String(value), "Δ"]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as (typeof meterRows)[0] | undefined;
                    return row
                      ? `${row.label}: ${row.prior} → ${row.neu} (${row.deltaLabel}) · ${row.confidence}`
                      : "";
                  }}
                />
                <ReferenceLine x={0} stroke="#64748b" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                  {meterRows.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {VINTAGE_METERS.map((m) => (
              <li key={m.id}>
                <span className="font-semibold text-slate-800">{m.label}:</span> {m.prior} → {m.neu}{" "}
                <span className="text-slate-500">
                  ({m.deltaLabel} · {m.confidence})
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "mmf" && mmfView === "correction" && (
        <ChartCard
          title="MMF restatement — Q3 $8.02T claim vs ICI Aug 19 official"
          subtitle="Aug 20 ICI release: week-ended Aug 19 totals $7.928T (−$92B vs Q3 theme)"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correctionBars} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}T`}
                  domain={[7.7, 8.15]}
                />
                <Tooltip formatter={(v) => [fmtTn(Number(v), 3), "AUM"]} />
                <Bar dataKey="totalTn" radius={[6, 6, 0, 0]}>
                  {correctionBars.map((r) => (
                    <Cell key={r.label} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Retail sleeve {fmtTn(HEADLINE.mmfRetailNewTn, 3)} · Government {fmtTn(HEADLINE.mmfGovNewTn, 3)} ·
            Prime {fmtTn(HEADLINE.mmfPrimeNewTn, 3)}
          </p>
        </ChartCard>
      )}

      {panel === "mmf" && mmfView === "path" && (
        <ChartCard
          title="ICI weekly MMF path into Aug 19"
          subtitle="Stacked retail + institutional — totals plateau near $7.93T"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mmfStack} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="mmfRetailFill608" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={RETAIL} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={RETAIL} stopOpacity={0.08} />
                  </linearGradient>
                  <linearGradient id="mmfInstFill608" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={MMF} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={MMF} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} domain={[0, 9]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const p = sorted[0]?.payload as (typeof mmfStack)[0];
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{p.label}</div>
                        <div>Total {fmtTn(p.total, 3)}</div>
                        <div>Retail {fmtTn(p.retail, 3)}</div>
                        <div>Institutional {fmtTn(p.institutional, 3)}</div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={8.02}
                  stroke={PRIOR}
                  strokeDasharray="4 4"
                  label={{ value: "Q3 $8.02T", fill: PRIOR, fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="retail"
                  stackId="1"
                  stroke={RETAIL}
                  fill="url(#mmfRetailFill608)"
                  name="Retail"
                />
                <Area
                  type="monotone"
                  dataKey="institutional"
                  stackId="1"
                  stroke={MMF}
                  fill="url(#mmfInstFill608)"
                  name="Institutional"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "revolving" && revolvingView === "path" && (
        <ChartCard
          title="G.19 revolving & total consumer credit into June"
          subtitle="June SA revolving $1.351T (+$7B MoM); total credit $5.167T"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={REVOLVING_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}T`}
                  domain={[1.2, 1.4]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}T`}
                  domain={[5.05, 5.2]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof REVOLVING_PATH)[0];
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{p.label}</div>
                        <div>Revolving {fmtTn(p.revolvingTn, 3)}</div>
                        <div>Total {fmtTn(p.totalTn, 3)}</div>
                      </div>
                    );
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revolvingTn"
                  fill={DEBT}
                  name="Revolving"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalTn"
                  stroke={NEW}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Total consumer credit"
                />
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "revolving" && revolvingView === "bridge" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Concept bridge — G.19 revolving vs NY Fed cards"
            subtitle="Different universes; do not treat as a QoQ card Δ"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...REVOLVING_VS_NYFED]} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} domain={[0, 1.6]} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as (typeof REVOLVING_VS_NYFED)[number];
                      return [fmtTn(Number(v), 3), row?.note ?? "Balance"];
                    }}
                  />
                  <Bar dataKey="tn" radius={[6, 6, 0, 0]}>
                    {REVOLVING_VS_NYFED.map((r) => (
                      <Cell key={r.label} fill={r.confidence === "disclosed" ? DEBT : PRIOR} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Carried NY Fed 2026Q2 product mix"
            subtitle="No new quarterly HHDC print — stock still mortgage-heavy"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debtShare} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as (typeof debtShare)[0];
                      return [`${fmtTn(Number(v))} (${row?.share}% share)`, "Balance"];
                    }}
                  />
                  <Bar dataKey="tn" fill={PRIOR} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "saving" && (
        <ChartCard
          title="Saving confirmation lag — June disclosed, July pending"
          subtitle="FRED PSAVERT still 2.7% (June); Q3 July 3.1% awaits Aug 26 BEA"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={SAVING_RATE_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 5]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof SAVING_RATE_PATH)[0];
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{p.label}</div>
                        <div>
                          {fmtPct(p.savingRatePct)} · {p.confidence} · {p.vintage}
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={3.1}
                  stroke={STRESS}
                  strokeDasharray="4 4"
                  label={{ value: "Q3 July claim 3.1%", fill: STRESS, fontSize: 10 }}
                />
                <ReferenceLine
                  y={2.7}
                  stroke={SAVE}
                  strokeDasharray="4 4"
                  label={{ value: "Disclosed June 2.7%", fill: SAVE, fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="savingRatePct"
                  stroke={SAVE}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                  name="Saving rate"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cash" && (
        <ChartCard
          title="Liquid cash sleeves — Q3 claim vs Aug 202608 official"
          subtitle="MMF sleeve restates lower; deposits remain estimated"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashRows} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                <Tooltip
                  formatter={(v, name) => [fmtTn(Number(v), 3), String(name)]}
                  labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload as (typeof cashRows)[0] | undefined;
                    return row
                      ? `${label} · Δ ${row.delta >= 0 ? "+" : "−"}$${Math.abs(row.delta * 1000).toFixed(0)}B · ~${row.yieldPct}% yield`
                      : String(label);
                  }}
                />
                <Bar dataKey="prior" fill={PRIOR} name="Q3 / prior" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neu" fill={MMF} name="Aug 202608" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "rates" && (
        <ChartCard
          title="Card APR − fed funds gap on disclosed prints"
          subtitle="May card APR 20.94% − July FEDFUNDS 3.63% ≈ 17.3 pp (still sticky)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={APR_GAP_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 25]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v} pp`}
                  domain={[15, 18]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof APR_GAP_PATH)[0];
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{p.label}</div>
                        <div>Card APR {fmtPct(p.cardAprPct, 2)}</div>
                        <div>Funds {fmtPct(p.fedFundsPct, 2)}</div>
                        <div>Gap {fmtPp(p.gapPp)}</div>
                      </div>
                    );
                  }}
                />
                <Bar yAxisId="left" dataKey="cardAprPct" fill={STRESS} name="Card APR" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="fedFundsPct"
                  stroke={FUNDS}
                  strokeWidth={2.5}
                  name="Fed funds"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gapPp"
                  stroke={GAP}
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  name="Gap (pp)"
                />
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a className="text-teal-700 underline-offset-2 hover:underline" href={s.url}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
