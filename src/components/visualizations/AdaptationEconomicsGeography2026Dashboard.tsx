"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DONOR_BLOCS,
  FLOW_RECIPIENTS,
  HAZARD_BY_REGION,
  HEADLINE,
  LOSS_REGIONS,
  METER_COMPARE,
  REGION_GAPS,
  SOURCE_NOTE,
  fmtBn,
  fmtPct,
  mismatchScatter,
  rankedGapsBy,
  resilienceGapScatter,
} from "@/data/adaptation-economics-geography-2026-data";

// viz-types: gap bars+pie, flow bars+dual, donor pie+bars, resilience×gap scatter, mismatch scatter, loss stacked+bars, hazard stacked, meter compare | layout: default

type ViewId = "gaps" | "flows" | "mismatch" | "damage";
type GapMetric = "gapBn" | "gapSharePct" | "resiliencePct";
type IncomeFilter = "all" | "advanced" | "emerging" | "developing";
type LossMetric = "economic" | "insured" | "uninsured";

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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AdaptationEconomicsGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("gaps");
  const [gapMetric, setGapMetric] = useState<GapMetric>("gapSharePct");
  const [incomeFilter, setIncomeFilter] = useState<IncomeFilter>("all");
  const [lossMetric, setLossMetric] = useState<LossMetric>("economic");

  const gapBars = useMemo(() => {
    let rows = rankedGapsBy(gapMetric);
    if (incomeFilter !== "all") {
      rows = rows.filter((r) => r.income === incomeFilter);
    }
    return rows;
  }, [gapMetric, incomeFilter]);

  const gapPie = useMemo(
    () =>
      REGION_GAPS.map((r) => ({
        name: r.short,
        value: r.gapSharePct,
        fill: r.fill,
      })),
    [],
  );

  const flowBars = useMemo(
    () => [...FLOW_RECIPIENTS].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  const dualMismatch = useMemo(
    () =>
      mismatchScatter().map((p) => ({
        short: p.short,
        gapSharePct: p.gapSharePct,
        flowSharePct: p.flowSharePct,
        fill: p.fill,
      })),
    [],
  );

  const donorPie = useMemo(
    () =>
      DONOR_BLOCS.map((d) => ({
        name: d.short,
        value: d.sharePct,
        fill: d.fill,
      })),
    [],
  );

  const resScatter = useMemo(() => {
    let rows = resilienceGapScatter();
    if (incomeFilter !== "all") {
      rows = rows.filter((r) => r.income === incomeFilter);
    }
    return rows;
  }, [incomeFilter]);

  const mismatchPts = useMemo(() => mismatchScatter(), []);

  const lossBars = useMemo(() => {
    const key =
      lossMetric === "economic"
        ? "economicSharePct"
        : lossMetric === "insured"
          ? "insuredSharePct"
          : "uninsuredBn";
    return [...LOSS_REGIONS].sort((a, b) => {
      const av =
        lossMetric === "uninsured" ? a.uninsuredBn : (a as never)[key];
      const bv =
        lossMetric === "uninsured" ? b.uninsuredBn : (b as never)[key];
      return Number(bv) - Number(av);
    });
  }, [lossMetric]);

  const lossStack = useMemo(
    () =>
      LOSS_REGIONS.map((r) => ({
        short: r.short,
        insured: r.insuredBn,
        uninsured: r.uninsuredBn,
        fill: r.fill,
      })),
    [],
  );

  const meters = useMemo(() => METER_COMPARE, []);

  return (
    <div
      className="space-y-6"
      data-viz="adaptation-economics-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Adaptation economics — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where damage dollars, adaptation flows, and capacity sit on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          {HEADLINE.top1GapRegionLabel} holds ~{HEADLINE.top1GapRegionSharePct}%
          of the ${HEADLINE.protectionGapBn}B protection-gap stock;{" "}
          {HEADLINE.top1FlowRegionLabel} takes ~{HEADLINE.top1FlowRegionSharePct}
          % of MDB LMIC adaptation ${HEADLINE.mdbLmicAdapt2025Bn}B;{" "}
          {HEADLINE.top1DonorBlocLabel} originates ~
          {HEADLINE.top1DonorBlocSharePct}% of OECD adaptation — three maps that
          disagree on who is exposed, who gets financed, and who writes the
          cheque.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Gap Top-1 share",
              value: fmtPct(HEADLINE.top1GapRegionSharePct, 1),
            },
            {
              label: "Gap Top-3 regions",
              value: fmtPct(HEADLINE.top3GapRegionSharePct, 1),
            },
            {
              label: "MDB flow Top-1",
              value: fmtPct(HEADLINE.top1FlowRegionSharePct),
            },
            {
              label: "Donor W. Europe",
              value: fmtPct(HEADLINE.top1DonorBlocSharePct),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "gaps", label: "Gap map" },
            { id: "flows", label: "Flow map" },
            { id: "mismatch", label: "Mismatch" },
            { id: "damage", label: "Damage map" },
          ]}
        />
        {view === "gaps" && (
          <>
            <ToggleGroup
              label="Metric"
              value={gapMetric}
              onChange={setGapMetric}
              options={[
                { id: "gapSharePct", label: "Share %" },
                { id: "gapBn", label: "Gap $" },
                { id: "resiliencePct", label: "Resilience" },
              ]}
            />
            <ToggleGroup
              label="Income"
              value={incomeFilter}
              onChange={setIncomeFilter}
              options={[
                { id: "all", label: "All" },
                { id: "advanced", label: "Advanced" },
                { id: "emerging", label: "Emerging" },
                { id: "developing", label: "Developing" },
              ]}
            />
          </>
        )}
        {(view === "mismatch") && (
          <ToggleGroup
            label="Income"
            value={incomeFilter}
            onChange={setIncomeFilter}
            options={[
              { id: "all", label: "All" },
              { id: "advanced", label: "Advanced" },
              { id: "emerging", label: "Emerging" },
              { id: "developing", label: "Developing" },
            ]}
          />
        )}
        {view === "damage" && (
          <ToggleGroup
            label="Loss metric"
            value={lossMetric}
            onChange={setLossMetric}
            options={[
              { id: "economic", label: "Economic %" },
              { id: "insured", label: "Insured %" },
              { id: "uninsured", label: "Uninsured $" },
            ]}
          />
        )}
      </div>

      {view === "gaps" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Protection-gap geography"
            subtitle={
              gapMetric === "gapBn"
                ? `Regional dollars inside the $${HEADLINE.protectionGapBn}B stock`
                : gapMetric === "resiliencePct"
                  ? "Insurance penetration vs exposure (lower = thinner cover)"
                  : `Share of $${HEADLINE.protectionGapBn}B Swiss Re-style protection gap`
            }
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gapBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      gapMetric === "gapBn" ? `$${v}B` : `${v}%`
                    }
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      gapMetric === "gapBn"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar dataKey={gapMetric} radius={[0, 4, 4, 0]}>
                    {gapBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Gap share pie"
            subtitle={`Top-3 regions = ${fmtPct(HEADLINE.top3GapRegionSharePct, 1)} of stock`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gapPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {gapPie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "flows" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="MDB recipient geography"
            subtitle={`Estimated regional shares of LMIC adaptation $${HEADLINE.mdbLmicAdapt2025Bn}B (2025)`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={flowBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 32]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {flowBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Donor-origin blocs"
            subtitle={`Where OECD adaptation $${HEADLINE.oecdAdapt2024Bn}B originates`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donorPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {donorPie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Gap share vs MDB flow share"
            subtitle="Same regions, two maps — positive bar = flow overweight vs gap $"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dualMismatch}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar
                    dataKey="gapSharePct"
                    name="Gap share"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="flowSharePct"
                    name="MDB flow share"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Geography meters"
            subtitle="Regional shares across gap, flow, donor, and loss maps"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meters}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 60]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={150}
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      fmtPct(Number(v), 1),
                      (p?.payload as { detail?: string })?.detail ?? "",
                    ]}
                  />
                  <Bar dataKey="valuePct" radius={[0, 4, 4, 0]}>
                    {meters.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "mismatch" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Resilience × protection gap"
            subtitle="Low-resilience / large-gap quadrant lights South Asia and SSA"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Resilience"
                    unit="%"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Resilience %",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Gap $"
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "Gap $" || name === "y"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v), 1)
                    }
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { short?: string })?.short ??
                      ""
                    }
                  />
                  <Scatter data={resScatter}>
                    {resScatter.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Gap share × MDB flow share"
            subtitle="Above diagonal = flow overweight vs uninsured-exposure share"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Gap share"
                    unit="%"
                    domain={[0, 28]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Gap share %",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Flow share"
                    unit="%"
                    domain={[0, 32]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v) => fmtPct(Number(v), 1)}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { short?: string })?.short ??
                      ""
                    }
                  />
                  <Scatter data={mismatchPts}>
                    {mismatchPts.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "damage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Economic vs insured geography"
            subtitle={
              lossMetric === "uninsured"
                ? "Uninsured residual dollars by region (FY 2025 framing)"
                : lossMetric === "insured"
                  ? "Insured loss share of global covered sleeve"
                  : "Economic loss share of ~$368B FY framing"
            }
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lossBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      lossMetric === "uninsured" ? `$${v}B` : `${v}%`
                    }
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      lossMetric === "uninsured"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v))
                    }
                  />
                  <Bar
                    dataKey={
                      lossMetric === "economic"
                        ? "economicSharePct"
                        : lossMetric === "insured"
                          ? "insuredSharePct"
                          : "uninsuredBn"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {lossBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Insured vs uninsured stack"
            subtitle="Covered sleeve vs residual by region ($B)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lossStack}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => fmtBn(Number(v))} />
                  <Bar
                    dataKey="insured"
                    stackId="a"
                    fill="#14b8a6"
                    name="Insured"
                  />
                  <Bar
                    dataKey="uninsured"
                    stackId="a"
                    fill="#f43f5e"
                    name="Uninsured"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Hazard mix inside residual"
            subtitle="Constructed hazard shares of uninsured burden by region"
          >
            <div className="h-[320px] w-full min-w-0 lg:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={HAZARD_BY_REGION}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="storm" stackId="h" fill="#0ea5e9" name="Storm" />
                  <Bar dataKey="flood" stackId="h" fill="#6366f1" name="Flood" />
                  <Bar
                    dataKey="drought"
                    stackId="h"
                    fill="#f59e0b"
                    name="Drought"
                  />
                  <Bar
                    dataKey="wildfire"
                    stackId="h"
                    fill="#f43f5e"
                    name="Wildfire"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
