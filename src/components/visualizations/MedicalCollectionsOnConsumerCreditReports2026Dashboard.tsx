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
  AGE_PREVALENCE,
  BALANCE_PATH,
  HEADLINE,
  MEDICAL_SHARE_VINTAGE,
  PREVALENCE_VINTAGE,
  REGION_SUMMARY,
  SCORE_BANDS,
  SOURCE_NOTE,
  STATE_PANEL,
  VIZ_MARKERS,
  fmtPct,
  fmtUsd,
  statesByRegion,
  type RegionId,
  type ScoreBandId,
} from "@/data/medical-collections-on-consumer-credit-reports-2026-data";

// viz-types: medical-share composed, prevalence path, state ladder bars,
// score-band stacked+bars, prevalence×share scatter, age dual bars
// | layout: default
// smoke-marker: Medical share of collections — 57%→36%

type ViewId =
  | "share"
  | "path"
  | "ladder"
  | "scores"
  | "scatter"
  | "ages";

type RegionFilter = "all" | RegionId;
type LadderSort = "prevalence" | "share" | "balance" | "drop";
type ScoreMetric = "holders" | "prevalence" | "medShare";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const REGION_COLORS: Record<string, string> = {
  South: ROSE,
  Midwest: TEAL,
  West: AMBER,
  Northeast: INDIGO,
};

const SCORE_COLORS: Record<ScoreBandId, string> = {
  "deep-subprime": ROSE,
  subprime: AMBER,
  "near-prime": SKY,
  "prime-plus": TEAL,
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
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function MedicalCollectionsOnConsumerCreditReports2026Dashboard() {
  const [view, setView] = useState<ViewId>("share");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [ladderSort, setLadderSort] = useState<LadderSort>("prevalence");
  const [scoreMetric, setScoreMetric] = useState<ScoreMetric>("holders");

  const ladderData = useMemo(() => {
    const rows = statesByRegion(region)
      .filter((s) => !s.stateBan)
      .map((s) => ({
        ...s,
        dropPp: +(s.prevalence2022 - s.prevalence2024).toFixed(1),
      }));
    const sorted = [...rows].sort((a, b) => {
      if (ladderSort === "prevalence") return b.prevalence2024 - a.prevalence2024;
      if (ladderSort === "share")
        return b.medicalShareOfCollections - a.medicalShareOfCollections;
      if (ladderSort === "balance") return b.avgBalance - a.avgBalance;
      return b.dropPp - a.dropPp;
    });
    return sorted.slice(0, 24);
  }, [region, ladderSort]);

  const scatterData = useMemo(() => {
    return statesByRegion(region)
      .filter((s) => !s.stateBan)
      .map((s) => ({
        ...s,
        x: s.prevalence2024,
        y: s.medicalShareOfCollections,
        z: s.avgBalance,
      }));
  }, [region]);

  const scoreChartData = useMemo(() => {
    return SCORE_BANDS.map((b) => ({
      ...b,
      value:
        scoreMetric === "holders"
          ? b.shareOfHolders
          : scoreMetric === "prevalence"
            ? b.prevalenceInBand
            : b.medicalShareOfCollections,
    }));
  }, [scoreMetric]);

  return (
    <div
      data-viz="medical-collections-on-consumer-credit-reports-2026"
      className="space-y-4"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Medical share of collections
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Third-party collections tradelines that are medical fell from{" "}
          <span className="font-semibold text-white">
            {HEADLINE.medicalShareQ1_2022}%
          </span>{" "}
          (Q1 2022) to{" "}
          <span className="font-semibold text-white">
            {HEADLINE.medicalShareQ1_2023}%
          </span>{" "}
          (Q1 2023). Consumer prevalence dropped from ~{HEADLINE.prevalenceMar2022}%
          to {HEADLINE.prevalenceAug2024}% (Urban Aug 2024), but remaining holders
          concentrate at mean score{" "}
          <span className="font-semibold text-amber-300">
            {HEADLINE.meanScoreJun2023}
          </span>{" "}
          with larger balances.
        </p>
        <p className="mt-2 text-xs text-slate-400">{VIZ_MARKERS[1]} · {VIZ_MARKERS[2]}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "share", label: "Medical share" },
            { id: "path", label: "Prevalence path" },
            { id: "ladder", label: "State ladder" },
            { id: "scores", label: "Score bands" },
            { id: "scatter", label: "Share × prevalence" },
            { id: "ages", label: "Age mix" },
          ]}
        />
      </div>

      {(view === "ladder" || view === "scatter") && (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <ToggleGroup<RegionFilter>
            value={region}
            onChange={setRegion}
            options={[
              { id: "all", label: "All regions" },
              { id: "South", label: "South" },
              { id: "Midwest", label: "Midwest" },
              { id: "West", label: "West" },
              { id: "Northeast", label: "Northeast" },
            ]}
          />
          {view === "ladder" && (
            <ToggleGroup<LadderSort>
              value={ladderSort}
              onChange={setLadderSort}
              options={[
                { id: "prevalence", label: "Sort by prevalence" },
                { id: "share", label: "Sort by med. share" },
                { id: "balance", label: "Sort by balance" },
                { id: "drop", label: "Sort by 2022→24 drop" },
              ]}
            />
          )}
        </div>
      )}

      {view === "scores" && (
        <ToggleGroup<ScoreMetric>
          value={scoreMetric}
          onChange={setScoreMetric}
          options={[
            { id: "holders", label: "Share of remaining holders" },
            { id: "prevalence", label: "Prevalence in band" },
            { id: "medShare", label: "Medical share of collections" },
          ]}
        />
      )}

      {view === "share" && (
        <ChartCard
          title="Medical share of third-party collections tradelines"
          subtitle="CFPB Market Snapshot Q1 2022 (57%) → FDCPA Annual Report Q1 2023 (36%) after <$500 removals"
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MEDICAL_SHARE_VINTAGE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  domain={[0, 70]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(0)}%`, "Medical share"]}
                />
                <Area
                  type="monotone"
                  dataKey="medicalSharePct"
                  fill={`${TEAL}33`}
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="medicalSharePct"
                  stroke={TEAL}
                  strokeWidth={3}
                  dot={{ r: 4, fill: TEAL }}
                  name="Medical share"
                />
                <ReferenceLine
                  y={57}
                  stroke={AMBER}
                  strokeDasharray="4 4"
                  label={{ value: "57% pre-change", fill: AMBER, fontSize: 11 }}
                />
                <ReferenceLine
                  y={36}
                  stroke={ROSE}
                  strokeDasharray="4 4"
                  label={{ value: "36% post-$500", fill: ROSE, fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "path" && (
        <ChartCard
          title="Share of consumers with medical collections on file"
          subtitle="CFPB CCP path through Jun 2023; Urban Aug 2024 endpoint at 4.1%. Jul 2022 and Apr 2023 reporting changes marked."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={PREVALENCE_VINTAGE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  domain={[0, 22]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)}%`, "Prevalence"]}
                />
                <Area
                  type="monotone"
                  dataKey="sharePct"
                  fill={`${INDIGO}22`}
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="sharePct"
                  stroke={INDIGO}
                  strokeWidth={3}
                  dot={{ r: 3, fill: INDIGO }}
                  name="Share with medical collections"
                />
                <ReferenceLine
                  x="Mar 2022"
                  stroke={AMBER}
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  x="Jun 2023"
                  stroke={TEAL}
                  strokeDasharray="3 3"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {BALANCE_PATH.map((r) => (
              <div
                key={r.period}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {r.period}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {fmtUsd(r.avgBalance)}
                </p>
                <p className="text-xs text-slate-500">
                  mean score {r.meanScore.toFixed(0)} · &lt;$500 share{" "}
                  {fmtPct(r.pctUnder500, 0)}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "ladder" && (
        <ChartCard
          title="State prevalence of medical debt in collections (Aug 2024)"
          subtitle="Urban-anchored Oklahoma 8.8%; CO/NY omitted (state bans = 0%). Desk-carried rates for other states — see source note."
        >
          <div className="h-[480px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ladderData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, name) => {
                    if (name === "prevalence2024")
                      return [fmtPct(Number(v)), "Aug 2024 prevalence"];
                    if (name === "medicalShareOfCollections")
                      return [fmtPct(Number(v), 0), "Est. medical share"];
                    return [fmtUsd(Number(v)), "Avg balance"];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.name ?? ""
                  }
                />
                <Bar
                  dataKey={
                    ladderSort === "share"
                      ? "medicalShareOfCollections"
                      : ladderSort === "balance"
                        ? "avgBalance"
                        : ladderSort === "drop"
                          ? "dropPp"
                          : "prevalence2024"
                  }
                  name={
                    ladderSort === "share"
                      ? "medicalShareOfCollections"
                      : ladderSort === "balance"
                        ? "avgBalance"
                        : ladderSort === "drop"
                          ? "dropPp"
                          : "prevalence2024"
                  }
                  radius={[0, 4, 4, 0]}
                >
                  {ladderData.map((s) => (
                    <Cell
                      key={s.abbr}
                      fill={REGION_COLORS[s.region] ?? TEAL}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {Object.entries(REGION_COLORS).map(([r, c]) => (
              <span key={r} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: c }}
                />
                {r}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "scores" && (
        <ChartCard
          title="Who still carries medical collections — by credit-score band"
          subtitle="Desk estimates among Jun 2023 remaining holders, calibrated to CFPB disclosed mean score 582. Deep subprime dominates both holder mix and medical share of collections."
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v) => [
                    fmtPct(Number(v), scoreMetric === "holders" ? 0 : 1),
                    scoreMetric === "holders"
                      ? "Share of remaining holders"
                      : scoreMetric === "prevalence"
                        ? "Prevalence in band"
                        : "Medical share of collections",
                  ]}
                  labelFormatter={(_, p) =>
                    `${p?.[0]?.payload?.label} (${p?.[0]?.payload?.scoreRange})`
                  }
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {scoreChartData.map((b) => (
                    <Cell key={b.id} fill={SCORE_COLORS[b.id]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Remaining holders mean score{" "}
            <strong>{HEADLINE.meanScoreJun2023}</strong> (down from{" "}
            {HEADLINE.meanScoreMar2022}); average balance{" "}
            <strong>{fmtUsd(HEADLINE.avgBalanceJun2023)}</strong>.
          </p>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Prevalence vs medical share of collections"
          subtitle="Bubble size = estimated average medical collections balance among holders. South cluster: high prevalence and high medical share."
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Prevalence"
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Aug 2024 prevalence (%)",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Medical share"
                  unit="%"
                  domain={[15, 55]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Est. medical share (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    if (name === "Prevalence") return [fmtPct(Number(v)), name];
                    if (name === "Medical share")
                      return [fmtPct(Number(v), 0), name];
                    return [String(v), name];
                  }}
                  labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
                />
                <Scatter data={scatterData} name="States">
                  {scatterData.map((s) => (
                    <Cell
                      key={s.abbr}
                      fill={REGION_COLORS[s.region] ?? TEAL}
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "ages" && (
        <ChartCard
          title="Age-group prevalence before and after reporting changes"
          subtitle="CFPB disclosed 62+ prevalence 8.4% → 2.7% (largest proportionate drop). Other bands desk-estimated to match holder-mix Table 1."
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGE_PREVALENCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="age" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v, name) => [
                    fmtPct(Number(v)),
                    name === "mar2022" ? "Mar 2022" : "Jun 2023",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="mar2022"
                  name="Mar 2022"
                  fill={SLATE}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="jun2023"
                  name="Jun 2023"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {REGION_SUMMARY.map((r) => (
              <div
                key={r.region}
                className="rounded-lg border border-slate-100 px-3 py-2"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {r.region}
                </p>
                <p className="text-lg font-bold" style={{ color: REGION_COLORS[r.region] }}>
                  {fmtPct(r.meanPrevalence2024)}
                </p>
                <p className="text-xs text-slate-500">
                  mean med. share ~{r.meanMedicalShare}%
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
