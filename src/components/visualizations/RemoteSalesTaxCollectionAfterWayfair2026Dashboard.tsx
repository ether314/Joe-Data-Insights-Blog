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
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ADOPTION_SERIES,
  ANALYTICS,
  CHANNEL_MIX_FY2025,
  COLLECTION_SERIES,
  HEADLINE,
  OFFSET_BANDS,
  SOURCE_NOTE,
  filterStates,
  type RegionFilter,
  type SortKey,
} from "@/data/remote-sales-tax-collection-after-wayfair-2026-data";

// smoke-marker: Remote-collection share

type Panel =
  | "share-path"
  | "channel-mix"
  | "state-ladder"
  | "offset-scatter"
  | "recovery-stack"
  | "nexus-adoption";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "share-path": {
    title: "Remote collections and share of GST",
    subtitle: `Remote-collection share rose from ${HEADLINE.remoteShare2017Pct}% (FY2017) to ${HEADLINE.remoteSharePct}% (FY2025)`,
  },
  "channel-mix": {
    title: "Who remits the remote dollars",
    subtitle: `Marketplace facilitators are ${HEADLINE.marketplaceOfRemotePct}% of remote remittance in FY2025`,
  },
  "state-ladder": {
    title: "Remote-collection share by state",
    subtitle: "Washington, Florida, and Texas lead the large-state ladder",
  },
  "offset-scatter": {
    title: "E-commerce intensity vs net offset",
    subtitle: "High e-commerce states recovered faster; several midwestern GST bases still run short",
  },
  "recovery-stack": {
    title: "Recovery dollars vs erosion drag",
    subtitle: `Panel cumulative recovery $${HEADLINE.cumulativeRemoteRecoveryB}B vs erosion $${HEADLINE.cumulativeErosionDragB}B (FY2018–25)`,
  },
  "nexus-adoption": {
    title: "Economic-nexus and marketplace adoption",
    subtitle: "Most GST states locked nexus and marketplace facilitator rules by 2020",
  },
};

const REGION_OPTS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

const SORT_OPTS: { id: SortKey; label: string }[] = [
  { id: "remoteShare", label: "Remote share" },
  { id: "netOffset", label: "Net offset $" },
  { id: "recovery", label: "Recovery $" },
  { id: "ecommerce", label: "E-commerce index" },
  { id: "yearsTo8", label: "Years to 8%" },
];

const PANEL_BTNS: { id: Panel; label: string }[] = [
  { id: "share-path", label: "Share path" },
  { id: "channel-mix", label: "Channel mix" },
  { id: "state-ladder", label: "State ladder" },
  { id: "offset-scatter", label: "Offset scatter" },
  { id: "recovery-stack", label: "Recovery stack" },
  { id: "nexus-adoption", label: "Nexus adoption" },
];

const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtB = (n: number) => `$${n.toFixed(1)}B`;

export function RemoteSalesTaxCollectionAfterWayfair2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("share-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sort, setSort] = useState<SortKey>("remoteShare");
  const [pathMode, setPathMode] = useState<"share" | "cumulative">("share");

  const meta = PANEL_META[panel];
  const states = useMemo(() => filterStates(region, sort), [region, sort]);

  const ladderData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        share: s.remoteSharePct,
        color: s.netOffsetB > 0.5 ? "#0f766e" : s.netOffsetB >= -0.5 ? "#b45309" : "#b91c1c",
      })),
    [states],
  );

  const scatterData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        ecommerce: s.ecommerceIndex,
        net: s.netOffsetB,
        share: s.remoteSharePct,
      })),
    [states],
  );

  const stackData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        recovery: s.recoveryB,
        erosion: s.erosionB,
      })),
    [states],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="remote-sales-tax-collection-after-wayfair-2026"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-300/90">
          Economics · Remote-collection share
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Remote sales-tax collection after Wayfair
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Large-state remote remittance is {fmtPct(HEADLINE.remoteSharePct)} of
          GST — up {HEADLINE.remoteShareRisePp} pp since FY2017. Cumulative
          recovery leads erosion by {fmtB(HEADLINE.netOffsetB)}, but only{" "}
          {HEADLINE.statesFullyOffset} of 12 panel states clear a clean offset.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        {PANEL_BTNS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          Region
          <select
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
          >
            {REGION_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          Sort
          <select
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {SORT_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {panel === "share-path" && (
          <div className="flex gap-1">
            {(
              [
                ["share", "Share + dollars"],
                ["cumulative", "Cumulative offset"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPathMode(id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  pathMode === id
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>

        <div className="mt-4 h-80 w-full">
          {panel === "share-path" && pathMode === "share" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={COLLECTION_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v, name) => {
                    const n = typeof v === "number" ? v : Number(v);
                    if (String(name).includes("share")) return fmtPct(n);
                    return fmtB(n);
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="marketplaceB"
                  name="Marketplace $B"
                  stackId="r"
                  fill="#2dd4bf"
                  stroke="#0f766e"
                  fillOpacity={0.7}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="remoteSellerB"
                  name="Remote seller $B"
                  stackId="r"
                  fill="#38bdf8"
                  stroke="#0284c7"
                  fillOpacity={0.65}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="remoteSharePct"
                  name="Remote share %"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "share-path" && pathMode === "cumulative" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COLLECTION_SERIES.filter((d) => d.year >= 2017)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip formatter={(v) => fmtB(Number(v))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cumRecoveryB"
                  name="Cum. recovery $B"
                  stroke="#0f766e"
                  fill="#5eead4"
                  fillOpacity={0.55}
                />
                <Area
                  type="monotone"
                  dataKey="cumErosionB"
                  name="Cum. erosion drag $B"
                  stroke="#b91c1c"
                  fill="#fca5a5"
                  fillOpacity={0.45}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {panel === "channel-mix" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHANNEL_MIX_FY2025}
                  dataKey="sharePct"
                  nameKey="shortLabel"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  paddingAngle={2}
                  label={(props) => {
                    const p = props as {
                      shortLabel?: string;
                      sharePct?: number;
                      name?: string;
                      value?: number;
                    };
                    const shortLabel = String(p.shortLabel ?? p.name ?? "");
                    const sharePct = Number(p.sharePct ?? p.value ?? 0);
                    return `${shortLabel} ${sharePct}%`;
                  }}
                >
                  {CHANNEL_MIX_FY2025.map((s) => (
                    <Cell key={s.id} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          {panel === "state-ladder" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ladderData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
                <Bar dataKey="share" name="Remote share %" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.abbr} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "offset-scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="ecommerce"
                  name="E-commerce index"
                  tick={{ fontSize: 11 }}
                  domain={[85, 140]}
                  label={{
                    value: "E-commerce index",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="net"
                  name="Net offset $B"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <ZAxis type="number" dataKey="share" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    const n = Number(v);
                    if (String(name).includes("net") || String(name).includes("Net"))
                      return fmtB(n);
                    if (String(name).includes("share")) return fmtPct(n);
                    return n;
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.abbr ?? ""
                  }
                />
                <Scatter name="States" data={scatterData} fill="#0f766e">
                  {scatterData.map((d) => (
                    <Cell
                      key={d.abbr}
                      fill={
                        d.net > 0.5
                          ? "#0f766e"
                          : d.net >= -0.5
                            ? "#d97706"
                            : "#dc2626"
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "recovery-stack" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="abbr" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip formatter={(v) => fmtB(Number(v))} />
                <Legend />
                <Bar
                  dataKey="recovery"
                  name="Recovery $B"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="erosion"
                  name="Erosion drag $B"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "nexus-adoption" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ADOPTION_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 50]} />
                <Tooltip />
                <Legend />
                <Line
                  type="stepAfter"
                  dataKey="nexusStates"
                  name="Economic-nexus states"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="stepAfter"
                  dataKey="marketplaceStates"
                  name="Marketplace-facilitator states"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {panel === "channel-mix" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {OFFSET_BANDS.map((b) => (
              <div
                key={b.id}
                className="rounded-md px-2.5 py-1.5 text-xs text-white"
                style={{ backgroundColor: b.color }}
              >
                {b.label}: {b.count} states ({b.gstWeightPct}% GST weight)
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="border-t border-slate-100 px-4 py-3 text-[10px] leading-relaxed text-slate-400 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
