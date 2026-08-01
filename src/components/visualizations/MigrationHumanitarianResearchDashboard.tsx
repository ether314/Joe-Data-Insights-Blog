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
  APPEALS_2025,
  DISPLACEMENT_COMPOSITION,
  DISPLACEMENT_VS_FUNDING,
  GHO_REGIONS,
  HEADLINE,
  HOST_DONOR_ROWS,
  HOSTING_BY_INCOME,
  SOURCE_NOTE,
  SOURCES,
  UNHCR_DONORS_2024,
  fmtBn,
  fmtM,
  fmtPct,
  type AppealRow,
  type RegionLane,
} from "@/data/migration-humanitarian-research-2026-data";

// viz-types: donut composition, dual-axis area+line, horizontal funding bars, host×donor scatter | layout: default

type RegionFilter = "All" | RegionLane;
type SortMode = "gap" | "req" | "people";
type RoleFilter = "all" | "host-heavy" | "donor-heavy" | "both" | "host-only";

const PIE_COLORS = ["#0f766e", "#0ea5e9", "#f59e0b"];
const APPEAL_COLORS: Record<AppealRow["kind"], string> = {
  HNRP: "#0f766e",
  Flash: "#f59e0b",
  "Regional RRP": "#a855f7",
};
const ROLE_COLORS: Record<string, string> = {
  "host-only": "#f43f5e",
  "host-heavy": "#f59e0b",
  both: "#0ea5e9",
  "donor-heavy": "#14b8a6",
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
                ? "bg-teal-800 text-white"
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

function AppealTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: AppealRow }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{row.name}</p>
      <p className="text-sm text-slate-700">
        Funded: <strong>{fmtPct(row.fundedPct)}</strong> ({fmtBn(row.fundedBn)} of {fmtBn(row.reqBn)})
      </p>
      <p className="text-sm text-slate-700">
        People in need: {fmtM(row.peopleInNeedM)} · targeted {fmtM(row.peopleTargetedM)}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {row.kind} · {row.region} · end-Sep 2025 FTS
      </p>
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: (typeof HOST_DONOR_ROWS)[number] }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{row.country}</p>
      <p className="text-sm text-slate-700">
        Hosted: <strong>{fmtM(row.hostedM)}</strong> ({row.hostedMetric})
      </p>
      <p className="text-sm text-slate-700">
        UNHCR donor:{" "}
        <strong>{row.unhcrDonorBn != null ? fmtBn(row.unhcrDonorBn, 2) : "n/a"}</strong>
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {row.income}-income · {row.role}
      </p>
    </div>
  );
}

export function MigrationHumanitarianResearchDashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("gap");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const appeals = useMemo(() => {
    const rows = APPEALS_2025.filter((a) => region === "All" || a.region === region);
    const sorted = [...rows].sort((a, b) => {
      if (sortMode === "gap") return a.fundedPct - b.fundedPct;
      if (sortMode === "req") return b.reqBn - a.reqBn;
      return b.peopleInNeedM - a.peopleInNeedM;
    });
    return sorted;
  }, [region, sortMode]);

  const scatterRows = useMemo(() => {
    return HOST_DONOR_ROWS.filter((r) => {
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      return true;
    }).map((r) => ({
      ...r,
      donorBn: r.unhcrDonorBn ?? 0.01,
      hasDonor: r.unhcrDonorBn != null,
    }));
  }, [roleFilter]);

  const pieTotal = DISPLACEMENT_COMPOSITION.reduce((s, d) => s + d.millions, 0);

  return (
    <div
      className="space-y-6"
      data-viz="migration-humanitarian-research-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Migration & humanitarian burden
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Record displacement, collapsing coverage
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          End-2024 forced displacement hit{" "}
          <strong className="text-white">{HEADLINE.displacedEnd2024M}M</strong>. Low- and
          middle-income countries host{" "}
          <strong className="text-white">{HEADLINE.lmicHostPct}%</strong> of refugees. OCHA
          GHO appeals were only{" "}
          <strong className="text-amber-300">{fmtPct(HEADLINE.ghoCoverage2025Pct, 1)}</strong>{" "}
          funded by end-Oct 2025; UNHCR covered{" "}
          <strong className="text-amber-300">{fmtPct(HEADLINE.unhcrFunded2025Pct)}</strong> of
          needs.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Displaced (end-2024)", value: fmtM(HEADLINE.displacedEnd2024M, 1) },
            { label: "LMIC host share", value: fmtPct(HEADLINE.lmicHostPct) },
            { label: "GHO appeal coverage", value: fmtPct(HEADLINE.ghoCoverage2025Pct, 1) },
            { label: "UNHCR funded 2025", value: fmtPct(HEADLINE.unhcrFunded2025Pct) },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</p>
              <p className="mt-1 text-xl font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Appeal region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "All", label: "All" },
            { id: "Africa", label: "Africa" },
            { id: "MENA", label: "MENA" },
            { id: "Europe", label: "Europe" },
            { id: "Asia-Pacific", label: "Asia-Pac" },
            { id: "Americas", label: "Americas" },
          ]}
        />
        <ToggleGroup
          label="Sort appeals"
          value={sortMode}
          onChange={setSortMode}
          options={[
            { id: "gap", label: "Worst funded" },
            { id: "req", label: "Largest $ need" },
            { id: "people", label: "Most people" },
          ]}
        />
        <ToggleGroup
          label="Host–donor roles"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { id: "all", label: "All" },
            { id: "host-only", label: "Host-only" },
            { id: "donor-heavy", label: "Donor-heavy" },
            { id: "both", label: "Both" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Where the displaced actually are"
          subtitle="End-2024 forced displacement composition — IDPs dominate the stock"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DISPLACEMENT_COMPOSITION}
                  dataKey="millions"
                  nameKey="short"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  paddingAngle={2}
                  label={(props) => {
                    const short = String(props.name ?? "");
                    const millions = Number(props.value ?? 0);
                    return `${short} ${((millions / pieTotal) * 100).toFixed(0)}%`;
                  }}
                >
                  {DISPLACEMENT_COMPOSITION.map((d, i) => (
                    <Cell key={d.short} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as (typeof DISPLACEMENT_COMPOSITION)[number];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.slice}</p>
                        <p>{fmtM(d.millions)} people</p>
                        <p className="text-xs text-slate-500">{d.note}</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
            {DISPLACEMENT_COMPOSITION.map((d, i) => (
              <div key={d.short}>
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full"
                  style={{ background: PIE_COLORS[i] }}
                />
                {fmtM(d.millions)} {d.short}
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="People up, money down"
          subtitle="Forced displacement stock vs share of UNHCR needs funded"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DISPLACEMENT_VS_FUNDING} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[70, 130]}
                  label={{ value: "Millions displaced", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[30, 70]}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: "% funded", angle: 90, position: "insideRight", style: { fontSize: 11 } }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as (typeof DISPLACEMENT_VS_FUNDING)[number];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{row.year}</p>
                        <p>Displaced: {fmtM(row.displacedM)} ({row.displacedConf})</p>
                        <p>UNHCR funded: {fmtPct(row.unhcrFundedPct)} ({row.unhcrFundedConf})</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="displacedM"
                  name="Displaced (M)"
                  fill="#0ea5e933"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="unhcrFundedPct"
                  name="UNHCR % funded"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <ReferenceLine yAxisId="right" y={50} stroke="#94a3b8" strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2024–25 displacement stocks are disclosed; earlier years are approximate decade-path
            estimates. Funded % uses Global Report series (2025 = 37%).
          </p>
        </ChartCard>
      </div>

      <ChartCard
        title="Appeal funding coverage by crisis"
        subtitle="OCHA GHO / FTS — end-Sep 2025. Sort and filter with the controls above."
      >
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={appeals}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 80]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="short"
                width={88}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<AppealTooltip />} />
              <ReferenceLine x={HEADLINE.ghoCoverage2025Pct} stroke="#64748b" strokeDasharray="4 4" />
              <Bar dataKey="fundedPct" name="% funded" radius={[0, 4, 4, 0]}>
                {appeals.map((a) => (
                  <Cell key={a.name} fill={APPEAL_COLORS[a.kind]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-teal-700" />
            HNRP
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500" />
            Flash
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-purple-500" />
            Regional RRP
          </span>
          <span className="text-slate-400">
            Dashed line = global GHO coverage ({fmtPct(HEADLINE.ghoCoverage2025Pct, 1)})
          </span>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Who hosts people vs who writes the cheque"
          subtitle="Host stock (x) vs 2024 UNHCR contribution (y) — log-friendly scale"
        >
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="hostedM"
                  name="Hosted (M)"
                  tick={{ fontSize: 11 }}
                  label={{ value: "People hosted (M)", position: "insideBottom", offset: -2, style: { fontSize: 11 } }}
                />
                <YAxis
                  type="number"
                  dataKey="donorBn"
                  name="UNHCR $bn"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => (v < 0.05 ? "0" : v.toFixed(1))}
                  label={{ value: "UNHCR donor $bn", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <ZAxis range={[60, 220]} />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={scatterRows} name="Countries">
                  {scatterRows.map((r) => (
                    <Cell
                      key={r.country}
                      fill={ROLE_COLORS[r.role]}
                      fillOpacity={r.hasDonor ? 0.9 : 0.55}
                      stroke={r.hasDonor ? undefined : "#94a3b8"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Host-only points sit near $0 on the donor axis (Iran, Uganda, Chad…). The US is the
            extreme donor-heavy outlier; Germany is the rare large host that also ranks among top
            UNHCR cash donors.
          </p>
        </ChartCard>

        <ChartCard
          title="Regional GHO coverage & UNHCR donor stack"
          subtitle="Coverage unevenness + concentration of cash among a few capitals"
        >
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GHO_REGIONS} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="region"
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  tick={{ fontSize: 9 }}
                  height={50}
                />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 50]} />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(0)}%`, "Coverage"]}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="coveragePct" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UNHCR_DONORS_2024} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [fmtBn(Number(v), 2), "2024 contribution"]}
                  labelFormatter={(l) => {
                    const d = UNHCR_DONORS_2024.find((x) => x.short === l);
                    return d?.donor ?? String(l);
                  }}
                />
                <Bar dataKey="bn" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            US alone supplied ~{fmtPct((HEADLINE.usDonor2024Bn / HEADLINE.unhcrAvailable2024Bn) * 100)}{" "}
            of UNHCR funds available in 2024 — then 2025 resources fell another $1.25B.
          </p>
        </ChartCard>
      </div>

      <ChartCard title="Hosting by income group" subtitle="Refugees & people needing international protection — end-2024">
        <div className="grid gap-3 sm:grid-cols-4">
          {HOSTING_BY_INCOME.map((g) => (
            <div
              key={g.group}
              className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {g.group}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{fmtPct(g.pct)}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Least Developed Countries (1.4% of global GDP) hosted{" "}
          <strong>{fmtPct(HEADLINE.ldcHostPct)}</strong> of refugees. Neighbouring countries hosted{" "}
          <strong>{fmtPct(HEADLINE.neighbourHostPct)}</strong>.
        </p>
      </ChartCard>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-teal-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
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
