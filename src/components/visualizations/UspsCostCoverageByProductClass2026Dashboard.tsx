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
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AGGREGATE_NONCOMP_LOSS,
  CLASS_COVERAGE_PATH,
  COMPLIANCE_COUNTS,
  FLATS_GAP,
  HEADLINE,
  LOSS_WATERFALL,
  MAIL_CLASSES,
  PRODUCT_COVERAGE,
  SOURCE_NOTE,
  fmtPct,
  fmtUsdM,
  type MailClass,
} from "@/data/usps-cost-coverage-by-product-class-2026-data";

// viz-types: multi-line class paths, horizontal product bars with 100% ref,
// loss waterfall bars, competitive-failure grouped bars, coverage-loss scatter
// | layout: default
// smoke-marker: Cost coverage % by class

type ViewId = "classes" | "products" | "losses" | "competitive" | "scatter";
type FyChoice = 2024 | 2025;

const ROSE = "#e11d48";
const AMBER = "#d97706";
const SKY = "#0284c8";
const EMERALD = "#059669";
const INDIGO = "#4f46e5";
const SLATE = "#64748b";
const VIOLET = "#7c3aed";

const CLASS_COLORS: Record<MailClass, string> = {
  "First-Class Mail": SKY,
  "USPS Marketing Mail": INDIGO,
  Periodicals: ROSE,
  "Package Services": AMBER,
  "Special Services": EMERALD,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "classes", label: "Class paths" },
  { id: "products", label: "Product bars" },
  { id: "losses", label: "Loss waterfall" },
  { id: "competitive", label: "Competitive gap" },
  { id: "scatter", label: "Coverage vs loss" },
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

export function UspsCostCoverageByProductClass2026Dashboard() {
  const [view, setView] = useState<ViewId>("classes");
  const [fy, setFy] = useState<FyChoice>(2025);
  const [classFilter, setClassFilter] = useState<MailClass | "all">("all");
  const [nonCompOnly, setNonCompOnly] = useState(true);

  const classSeries = useMemo(() => {
    const rows: Record<string, string | number>[] = [];
    const fys = [2021, 2022, 2023, 2024, 2025];
    for (const year of fys) {
      const row: Record<string, string | number> = { fy: `FY${year}` };
      for (const mc of MAIL_CLASSES) {
        const hit = CLASS_COVERAGE_PATH.find(
          (r) => r.fy === year && r.mailClass === mc,
        );
        if (hit) row[mc] = hit.coveragePct;
      }
      rows.push(row);
    }
    return rows;
  }, []);

  const productBars = useMemo(() => {
    let rows = PRODUCT_COVERAGE.map((p) => ({
      label: p.label,
      coverage: fy === 2025 ? p.fy2025 : p.fy2024,
      compliant: fy === 2025 ? p.compliant2025 : p.compliant2024,
      mailClass: p.mailClass,
    }));
    if (classFilter !== "all") {
      rows = rows.filter((r) => r.mailClass === classFilter);
    }
    if (nonCompOnly) {
      rows = rows.filter((r) => !r.compliant);
    }
    return rows.sort((a, b) => a.coverage - b.coverage);
  }, [fy, classFilter, nonCompOnly]);

  const scatterPts = useMemo(() => {
    return FLATS_GAP.filter((p) => p.negativeContribution2025).map((p) => ({
      label: p.label,
      coverage: p.fy2025,
      loss: p.negativeContribution2025 ?? 0,
      fill: p.compliant2025 ? EMERALD : ROSE,
    }));
  }, []);

  const competitiveBars = useMemo(() => {
    return COMPLIANCE_COUNTS.filter((r) => r.segment === "competitive").map(
      (r) => ({
        fy: `FY${r.fy}`,
        failures: r.failures,
      }),
    );
  }, []);

  const visibleClasses =
    classFilter === "all" ? MAIL_CLASSES : [classFilter];

  return (
    <div
      className="space-y-4"
      data-viz="usps-cost-coverage-by-product-class-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-rose-50/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">
          Cost coverage % by class
        </p>
        <p className="mt-1 text-sm text-slate-700">
          Periodicals class at{" "}
          <span className="font-semibold text-rose-700">
            {fmtPct(HEADLINE.periodicalsCoverage2025)}
          </span>{" "}
          in FY2025 — still the only non-compensatory Market Dominant class.
          Marketing Mail flats fell to{" "}
          <span className="font-semibold text-rose-700">
            {fmtPct(HEADLINE.mktFlatsCoverage2025)}
          </span>
          . Competitive products failing cost coverage doubled to{" "}
          <span className="font-semibold text-amber-700">
            {HEADLINE.competitiveFailures2025}
          </span>{" "}
          under Delivering for America rate resets.
        </p>
        <p className="mt-2 text-xs text-slate-500">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
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
        <ControlRow label="Fiscal year">
          <ToggleBtn active={fy === 2024} onClick={() => setFy(2024)}>
            FY2024
          </ToggleBtn>
          <ToggleBtn active={fy === 2025} onClick={() => setFy(2025)}>
            FY2025
          </ToggleBtn>
        </ControlRow>
        <ControlRow label="Class">
          <ToggleBtn
            active={classFilter === "all"}
            onClick={() => setClassFilter("all")}
          >
            All classes
          </ToggleBtn>
          {MAIL_CLASSES.map((mc) => (
            <ToggleBtn
              key={mc}
              active={classFilter === mc}
              onClick={() => setClassFilter(mc)}
            >
              {mc.replace("USPS ", "")}
            </ToggleBtn>
          ))}
        </ControlRow>
        {view === "products" ? (
          <ControlRow label="Filter">
            <ToggleBtn active={nonCompOnly} onClick={() => setNonCompOnly(true)}>
              Non-compensatory only
            </ToggleBtn>
            <ToggleBtn
              active={!nonCompOnly}
              onClick={() => setNonCompOnly(false)}
            >
              All products
            </ToggleBtn>
          </ControlRow>
        ) : null}
      </div>

      {view === "classes" ? (
        <ChartCard
          title="Market Dominant class cost coverage, FY2021–FY2025"
          subtitle="100% line = attributable cost break-even · PRC ACD Tables III-1–III-8"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={classSeries} margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={[0, 280]}
                tickFormatter={(v) => `${v}%`}
              />
              <ReferenceLine
                y={100}
                stroke={ROSE}
                strokeDasharray="4 4"
                label={{ value: "100%", fill: ROSE, fontSize: 10 }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {visibleClasses.map((mc) => (
                <Line
                  key={mc}
                  type="monotone"
                  dataKey={mc}
                  stroke={CLASS_COLORS[mc]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={mc.replace("USPS ", "")}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "products" ? (
        <ChartCard
          title={`Product cost coverage — FY${fy}`}
          subtitle="Flats still below 100% after DFA network reset"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productBars}
              layout="vertical"
              margin={{ left: 24, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                domain={[0, 160]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tick={{ fontSize: 10 }}
              />
              <ReferenceLine
                x={100}
                stroke={ROSE}
                strokeDasharray="4 4"
                label={{ value: "100%", fill: ROSE, fontSize: 10 }}
              />
              <Tooltip
                formatter={(v) => [fmtPct(Number(v ?? 0)), "Coverage"]}
                labelStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="coverage" radius={[0, 4, 4, 0]}>
                {productBars.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.compliant ? EMERALD : ROSE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "losses" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="FY2025 non-compensatory loss components"
            subtitle="Loss waterfall · ACD Chapter III ($M negative contribution)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LOSS_WATERFALL} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
                <Tooltip formatter={(v) => [fmtUsdM(Number(v ?? 0)), "Loss"]} />
                <Bar dataKey="lossMillions" fill={ROSE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Aggregate non-compensatory loss, FY2021–FY2025"
            subtitle={`FY2025 total: ${fmtUsdM(HEADLINE.nonCompLoss2025)}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={AGGREGATE_NONCOMP_LOSS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tickFormatter={(v) => `FY${v}`} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
                <Tooltip formatter={(v) => [fmtUsdM(Number(v ?? 0)), "Loss"]} />
                <Bar dataKey="lossMillions" fill={AMBER} radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="lossMillions"
                  stroke={SLATE}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "competitive" ? (
        <ChartCard
          title="Competitive products failing §3633(a)(2)"
          subtitle="Competitive failures doubled — 10 in FY2024 to 18 in FY2025"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitiveBars} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="failures" fill={VIOLET} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="Coverage vs negative contribution (FY2025 flats gap)"
          subtitle="Lower-left quadrant = structural underpricing"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="coverage"
                name="Coverage"
                domain={[60, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Cost coverage %",
                  position: "bottom",
                  fontSize: 10,
                }}
              />
              <YAxis
                type="number"
                dataKey="loss"
                name="Loss"
                tickFormatter={(v) => `$${v}M`}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Negative contribution ($M)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                }}
              />
              <ZAxis range={[120, 120]} />
              <ReferenceLine x={100} stroke={ROSE} strokeDasharray="4 4" />
              <RechartsTooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) =>
                  name === "Coverage"
                    ? fmtPct(Number(v ?? 0))
                    : fmtUsdM(Number(v ?? 0))
                }
              />
              <Scatter data={scatterPts} fill={ROSE}>
                {scatterPts.map((p) => (
                  <Cell key={p.label} fill={ROSE} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      <p className="text-center text-xs text-slate-400">
        Flats still below 100% · Competitive failures doubled · PRC ACD FY2024–FY2025
      </p>
    </div>
  );
}
