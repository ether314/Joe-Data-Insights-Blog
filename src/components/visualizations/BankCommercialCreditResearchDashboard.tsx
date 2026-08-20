"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  CMBS_PROPERTY_DELINQ,
  CRE_CONCENTRATION,
  CRE_PDNA_BY_SIZE,
  HEADLINE,
  LOAN_BOOK_STRESS,
  QUARTERLY_STRESS,
  SLOOS_TIGHTENING,
  SOURCE_NOTE,
  SOURCES,
  STRESS_MULTIPLES,
  fmtMultiple,
  fmtPct,
} from "@/data/bank-commercial-credit-research-2026-data";

// viz-types: delinq×chargeoff scatter, dual-line CRE path, size-cohort bars, concentration bars, CMBS multi-line, SLOOS composed | layout: canvas

type Panel = "map" | "crePath" | "size" | "concentration" | "cmbs" | "sloos";
type RangeMode = "full" | "postHike";
type Highlight = "all" | "cre" | "cards" | "ci";

const CRE = "#0ea5e9";
const CARDS = "#f59e0b";
const CI = "#a78bfa";
const OFFICE = "#f43f5e";
const MF = "#14b8a6";
const RETAIL = "#fb923c";
const IND = "#64748b";
const HOTEL = "#e879f9";
const OVERALL = "#38bdf8";
const TIGHTEN = "#0f766e";

const CAT_COLORS: Record<string, string> = {
  Cards: CARDS,
  "Other cons.": "#fb7185",
  Resi: "#64748b",
  CRE,
  "C&I": CI,
  Leases: "#94a3b8",
  Ag: "#84cc16",
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function GenericTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label != null && <p className="mb-1 font-semibold text-slate-800">{label}</p>}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600">
          <span style={{ color: p.color }}>{p.name ?? p.dataKey}</span>:{" "}
          {typeof p.value === "number"
            ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : p.value}
        </p>
      ))}
    </div>
  );
}

export function BankCommercialCreditResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("map");
  const [range, setRange] = useState<RangeMode>("full");
  const [highlight, setHighlight] = useState<Highlight>("all");

  const yearFloor = range === "postHike" ? 2023 : 2019;

  const quarterly = useMemo(
    () => QUARTERLY_STRESS.filter((r) => r.sortKey >= yearFloor),
    [yearFloor],
  );

  const sloos = useMemo(
    () => SLOOS_TIGHTENING.filter((r) => r.sortKey >= yearFloor),
    [yearFloor],
  );

  const cmbs = useMemo(
    () => CMBS_PROPERTY_DELINQ.filter((r) => r.year >= (range === "postHike" ? 2023 : 2022)),
    [range],
  );

  const sizeCohort = useMemo(
    () => CRE_PDNA_BY_SIZE.filter((r) => r.year >= (range === "postHike" ? 2023 : 2022)),
    [range],
  );

  const scatterData = useMemo(() => {
    return LOAN_BOOK_STRESS.map((r) => ({
      ...r,
      dim:
        highlight === "all"
          ? false
          : highlight === "cre"
            ? r.short !== "CRE"
            : highlight === "cards"
              ? r.short !== "Cards"
              : r.short !== "C&I",
    }));
  }, [highlight]);

  return (
    <div
      className="space-y-4"
      data-viz="bank-commercial-credit-research-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-6 text-white shadow-sm sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/90">
          Bank &amp; commercial credit — Fed · FDIC · CMBS
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Where stress shows up on loan books and CRE
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          As of {HEADLINE.asOf}, CRE delinquency sits at{" "}
          <span className="font-semibold text-cyan-200">
            {fmtPct(HEADLINE.creDelinquencyPct)}
          </span>{" "}
          while CRE charge-offs are only{" "}
          <span className="font-semibold text-cyan-200">
            {fmtPct(HEADLINE.creChargeOffPct)}
          </span>
          — a ~{HEADLINE.creDelinqToChargeMultiple}× past-due stock vs realized
          loss. Cards still own the loss ledger at{" "}
          {fmtPct(HEADLINE.cardsChargeOffPct)}. CMBS office delinquencies print{" "}
          {fmtPct(HEADLINE.cmbsOfficeDelinqPct, 1)}.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              CRE delinq / charge-off
            </p>
            <p className="text-xl font-bold text-cyan-200">
              {fmtMultiple(HEADLINE.creDelinqToChargeMultiple)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              CMBS office delinq.
            </p>
            <p className="text-xl font-bold text-rose-300">
              {fmtPct(HEADLINE.cmbsOfficeDelinqPct, 1)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Mid-bank CRE concentration
            </p>
            <p className="text-xl font-bold text-amber-200">
              {HEADLINE.midBankCreConcentrationPct}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <ToggleGroup<Panel>
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "map", label: "Stress map" },
            { id: "crePath", label: "CRE path" },
            { id: "size", label: "Bank size" },
            { id: "concentration", label: "Concentration" },
            { id: "cmbs", label: "CMBS" },
            { id: "sloos", label: "SLOOS" },
          ]}
        />
        <ToggleGroup<RangeMode>
          label="Range"
          value={range}
          onChange={setRange}
          options={[
            { id: "full", label: "Full" },
            { id: "postHike", label: "Post-hike" },
          ]}
        />
        {(panel === "map" || panel === "crePath") && (
          <ToggleGroup<Highlight>
            label="Highlight"
            value={highlight}
            onChange={setHighlight}
            options={[
              { id: "all", label: "All" },
              { id: "cre", label: "CRE" },
              { id: "cards", label: "Cards" },
              { id: "ci", label: "C&I" },
            ]}
          />
        )}
      </div>

      {panel === "map" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Delinquency × charge-off (latest)"
            subtitle="Past-due stock vs realized annualized losses — Fed SA, all banks"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="delinquency"
                    name="Delinquency"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Delinquency %",
                      position: "insideBottom",
                      offset: -14,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="chargeOff"
                    name="Charge-off"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Charge-off %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload as (typeof scatterData)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-800">{d.category}</p>
                          <p>Delinq: {fmtPct(d.delinquency)}</p>
                          <p>Charge-off: {fmtPct(d.chargeOff)}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} name="Categories">
                    {scatterData.map((d) => (
                      <Cell
                        key={d.short}
                        fill={CAT_COLORS[d.short] ?? "#64748b"}
                        fillOpacity={d.dim ? 0.2 : 0.95}
                        stroke={d.dim ? "#cbd5e1" : "#0f172a"}
                        strokeWidth={d.dim ? 0 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Cards sit high on both axes. CRE is mid-delinquency / low
              charge-off — stress is still mostly on the past-due line, not the
              loss ledger.
            </p>
          </ChartCard>

          <ChartCard
            title="Delinquency / charge-off multiple"
            subtitle="Higher multiple = more past-due stock relative to realized losses"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={STRESS_MULTIPLES.filter((r) => r.multiple < 99)}
                  layout="vertical"
                  margin={{ top: 8, right: 24, bottom: 8, left: 72 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="×" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    tick={{ fontSize: 11 }}
                    width={68}
                  />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="multiple" name="Multiple" radius={[0, 4, 4, 0]}>
                    {STRESS_MULTIPLES.filter((r) => r.multiple < 99).map((d) => (
                      <Cell
                        key={d.short}
                        fill={CAT_COLORS[d.short] ?? "#64748b"}
                        fillOpacity={
                          highlight === "all" ||
                          (highlight === "cre" && d.short === "CRE") ||
                          (highlight === "cards" && d.short === "Cards") ||
                          (highlight === "ci" && d.short === "C&I")
                            ? 1
                            : 0.25
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Residential prints near-zero charge-offs with ~{fmtPct(1.89)}{" "}
              delinquency — excluded from the bar scale as an open multiple.
              CRE ~{fmtMultiple(HEADLINE.creDelinqToChargeMultiple)} vs cards ~
              {fmtMultiple(HEADLINE.cardsDelinqToChargeMultiple)}.
            </p>
          </ChartCard>
        </div>
      )}

      {panel === "crePath" && (
        <ChartCard
          title="CRE path: delinquency vs charge-offs"
          subtitle="Fed SA commercial RE — past-dues climbed; realized losses stayed small"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={quarterly}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 5]}
                />
                <Tooltip content={<GenericTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="creDelinq"
                  name="CRE delinquency"
                  stroke={CRE}
                  strokeWidth={highlight === "cards" || highlight === "ci" ? 1.5 : 3}
                  strokeOpacity={highlight === "cards" || highlight === "ci" ? 0.35 : 1}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="creChargeOff"
                  name="CRE charge-off"
                  stroke="#0369a1"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  strokeOpacity={highlight === "cards" || highlight === "ci" ? 0.35 : 1}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cardsChargeOff"
                  name="Cards charge-off"
                  stroke={CARDS}
                  strokeWidth={highlight === "cre" || highlight === "ci" ? 1.5 : 2.5}
                  strokeOpacity={highlight === "cre" || highlight === "ci" ? 0.3 : 1}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ciChargeOff"
                  name="C&I charge-off"
                  stroke={CI}
                  strokeWidth={highlight === "cre" || highlight === "cards" ? 1.5 : 2}
                  strokeOpacity={highlight === "cre" || highlight === "cards" ? 0.3 : 1}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Left axis: CRE delinquency / CRE &amp; C&amp;I charge-offs. Right
            axis: card charge-offs (much higher scale). CRE past-dues roughly
            doubled from the 2021 trough; card losses still dwarf CRE
            write-offs.
          </p>
        </ChartCard>
      )}

      {panel === "size" && (
        <ChartCard
          title="CRE PDNA by bank asset size"
          subtitle="FDIC-style median past-due + nonaccrual — stress concentrated at the largest banks"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sizeCohort}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<GenericTooltip />} />
                <Bar dataKey="gt100bn" name=">$100B" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                <Bar dataKey="bn10to100" name="$10–100B" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="bn1to10" name="$1–10B" fill="#67e8f9" radius={[3, 3, 0, 0]} />
                <Bar dataKey="lt1bn" name="<$1B" fill="#a5f3fc" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Largest banks peaked near {fmtPct(1.92)} median CRE PDNA in 2024
            and eased to ~{fmtPct(HEADLINE.largeBankCrePdnaMedianPct)} in 2025 —
            still well above smaller cohorts. Nonfarm nonresidential (office-heavy)
            and multifamily drove the large-bank print.
          </p>
        </ChartCard>
      )}

      {panel === "concentration" && (
        <ChartCard
          title="CRE concentration vs tier-1 capital + ACL"
          subtitle="Median CRE / (T1 + ACL) — mid-size banks hold the densest books"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...CRE_CONCENTRATION].sort(
                  (a, b) => b.concentrationPct - a.concentrationPct,
                )}
                layout="vertical"
                margin={{ top: 8, right: 28, bottom: 8, left: 88 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis type="category" dataKey="short" tick={{ fontSize: 11 }} width={84} />
                <Tooltip content={<GenericTooltip />} />
                <Bar
                  dataKey="concentrationPct"
                  name="CRE / capital"
                  radius={[0, 4, 4, 0]}
                >
                  {[...CRE_CONCENTRATION]
                    .sort((a, b) => b.concentrationPct - a.concentrationPct)
                    .map((d) => (
                      <Cell
                        key={d.short}
                        fill={
                          d.short === "$1–10B" || d.short === "$10–100B"
                            ? "#f59e0b"
                            : d.short === "Industry"
                              ? "#0ea5e9"
                              : "#94a3b8"
                        }
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Industry median ~{HEADLINE.industryCreConcentrationMedianPct}% of
            capital. Banks in the $1–10B and $10–100B bands sit near{" "}
            {HEADLINE.midBankCreConcentrationPct}–311% — denser CRE books even
            when their PDNA ratios look calmer than the megabanks.
          </p>
        </ChartCard>
      )}

      {panel === "cmbs" && (
        <ChartCard
          title="CMBS delinquency by property type"
          subtitle="Securitized CRE stress — office remains the outlier; multifamily climbed hardest YoY"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cmbs} margin={{ top: 12, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<GenericTooltip />} />
                <Line type="monotone" dataKey="office" name="Office" stroke={OFFICE} strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="multifamily" name="Multifamily" stroke={MF} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="retail" name="Retail" stroke={RETAIL} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hotel" name="Hotel" stroke={HOTEL} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="industrial" name="Industrial" stroke={IND} strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="overall"
                  name="Overall"
                  stroke={OVERALL}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Dec 2025: office {fmtPct(HEADLINE.cmbsOfficeDelinqPct, 1)},
            multifamily {fmtPct(HEADLINE.cmbsMultifamilyDelinqPct, 1)}, overall{" "}
            {fmtPct(HEADLINE.cmbsOverallDelinqPct, 1)}. Bank books lag CMBS
            because Call Report CRE mixes owner-occupied, multifamily, and ADC —
            and because modifications pull loans off the PDNA line.
          </p>
        </ChartCard>
      )}

      {panel === "sloos" && (
        <ChartCard
          title="SLOOS: net % of banks tightening standards"
          subtitle="Positive = net tightening — CRE standards remain firmer than C&I"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sloos} margin={{ top: 12, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                  domain={[0, "auto"]}
                />
                <Tooltip content={<GenericTooltip />} />
                <Bar dataKey="cre" name="CRE net tighten %" fill={CRE} radius={[3, 3, 0, 0]} />
                <Bar dataKey="ci" name="C&I net tighten %" fill={CI} radius={[3, 3, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="cre"
                  name="CRE trend"
                  stroke={TIGHTEN}
                  strokeWidth={2}
                  dot={false}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Peak hiking-cycle tightening has faded, but CRE still shows net
            tightening near {HEADLINE.sloosCreNetTightenPct} pp vs C&amp;I near{" "}
            {HEADLINE.sloosCiNetTightenPct} pp ({HEADLINE.asOf} estimate). Credit
            supply remains selective even as realized CRE charge-offs stay low.
          </p>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-800 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
