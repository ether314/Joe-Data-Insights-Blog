"use client";

import { useMemo, useState } from "react";
import {
  EURO_SET,
  EUROZONE,
  MAP_EXTRAS,
  MAP_POINTS,
  MAP_REGIONS,
  PEGS,
  SOURCE_NOTE,
  WORLD,
  type MapFeat,
  type Peg,
} from "@/data/world-currency-pegs-2026-data";

// viz-types: anchor-currency choropleth, IMF-class choropleth, country detail table | layout: default
// smoke-marker: World currency pegs — anchor view

type MapMode = "anc" | "imf";
type SortKey = "c" | "iso" | "anc" | "kind" | "since" | "vol" | "status";
type RegionId = (typeof MAP_REGIONS)[number]["id"];

const NAVY_BG = "#0f1629";
const NAVY_DEEP = "#0a1020";
const NAVY_PANEL = "#131c33";
const NAVY_BORDER = "#1f2a44";
const INK = "#e2e8f0";
const INK_MUTED = "#94a3b8";
const INK_DIM = "#64748b";

// Anchor palette
const COL_USD = "#3b82f6";
const COL_EUR = "#06b6d4";
const COL_GBP = "#ec4899";
const COL_BASKET = "#a855f7";
const COL_OTHER = "#f97316";

// IMF-class palette (no-tender / board / conventional / crawl / dirty / other)
const COL_NO_TENDER = "#1d4ed8";
const COL_BOARD = "#0891b2";
const COL_CONV = "#22d3ee";
const COL_CRAWL = "#f97316";
const COL_DIRTY = "#d97706";
const COL_OTHER_IMF = "#475569";
const COL_FLOAT = "#334155";

function ancFill(anc: string): string {
  if (anc === "USD") return COL_USD;
  if (anc === "EUR" || anc === "DKK") return COL_EUR;
  if (anc === "GBP") return COL_GBP;
  if (anc === "Basket") return COL_BASKET;
  return COL_OTHER;
}

function imfBucket(peg: Peg | null, name: string): "no-tender" | "board" | "conventional" | "crawl" | "dirty" | "other" | "float" {
  if (!peg) {
    if (EURO_SET.has(name)) return "float";
    return "float";
  }
  const imf = (peg.imf ?? "").toLowerCase();
  if (imf.includes("no separate legal")) return "no-tender";
  if (imf.includes("currency board")) return "board";
  if (imf.includes("crawl-like")) return "crawl";
  if (imf.includes("crawling peg") || imf.includes("crawling band") || imf.includes("crawl")) return "crawl";
  if (imf.includes("stabilized")) return "dirty";
  if (imf.includes("conventional peg")) return "conventional";
  if (imf.includes("horizontal band")) return "dirty";
  if (imf.includes("other managed") || imf.includes("not an imf")) return "other";
  if (imf.includes("exited") || imf.includes("free floating")) return "float";
  return peg.kind === "Hard" ? "no-tender" : peg.kind === "Soft" ? "conventional" : peg.kind === "Crawl" ? "crawl" : peg.kind === "Dirty" ? "dirty" : "other";
}

function imfFill(b: ReturnType<typeof imfBucket>): string {
  if (b === "no-tender") return COL_NO_TENDER;
  if (b === "board") return COL_BOARD;
  if (b === "conventional") return COL_CONV;
  if (b === "crawl") return COL_CRAWL;
  if (b === "dirty") return COL_DIRTY;
  if (b === "other") return COL_OTHER_IMF;
  return COL_FLOAT;
}

function paintFor(name: string, pegByName: Map<string, Peg>): { peg: Peg | null; kind: "hard" | "soft" | "crawl" | "dirty" | "other" | "euro"; anc: string; status: Peg["status"]; rate: string; dual: boolean } | null {
  const peg = pegByName.get(name);
  if (peg && peg.status !== "Exited") {
    return {
      peg,
      kind: peg.kind === "Hard" ? "hard" : peg.kind === "Soft" ? "soft" : peg.kind === "Crawl" ? "crawl" : peg.kind === "Dirty" ? "dirty" : "other",
      anc: peg.anc,
      status: peg.status,
      rate: peg.rate,
      dual: peg.dual,
    };
  }
  if (peg && peg.status === "Exited" && EURO_SET.has(name)) {
    return { peg, kind: "euro", anc: "EUR", status: "Floating union", rate: "Euro-area member (joined)", dual: false };
  }
  if (name === "United States of America") {
    return { peg: null, kind: "other", anc: "USD", status: "Floating union", rate: "Issuer of USD; USD floats vs EUR, JPY, GBP", dual: false };
  }
  const extra = MAP_EXTRAS[name];
  if (extra) {
    return { peg: null, kind: extra.kind === "Hard" ? "hard" : "soft", anc: extra.anc, status: "Intact", rate: extra.rate, dual: false };
  }
  if (EURO_SET.has(name)) {
    return { peg: null, kind: "euro", anc: "EUR", status: "Floating union", rate: "Euro-area member — euro floats as a bloc", dual: false };
  }
  return null;
}

function volLabel(p: Peg): string {
  if (p.vol == null) return "—";
  if (p.vq === "z") return "0%";
  const n = p.vol >= 10 ? p.vol.toFixed(1) : p.vol.toFixed(2);
  if (p.vq === "n") return `~${n}%`;
  if (p.vq === "x") return "—";
  return `${n}%`;
}

function buildPegByName(rows: Peg[]): Map<string, Peg> {
  const m = new Map<string, Peg>();
  for (const r of rows) {
    if (r.ent === "Bloc") continue;
    m.set(r.c, r);
  }
  return m;
}

function regionFor(name: string): string {
  // light-weight grouping via the source data's `region` field when available
  const p = PEGS.find((r) => r.c === name);
  return p?.region ?? "Other";
}

function notesFromPeg(p: Peg): string {
  // Build a short one-liner from move + how.
  const text = (p.move ?? "").trim();
  if (text && text.length <= 120) return text;
  // Fallback: take first sentence from how.
  const how = (p.how ?? "").split(/[.!?]/)[0]?.trim() ?? "";
  if (how.length <= 120) return how + ".";
  return how.slice(0, 117) + "…";
}

function PegChoropleth({
  mode,
  pegByName,
  regionId,
  hover,
  setHover,
  selected,
  setSelected,
}: {
  mode: MapMode;
  pegByName: Map<string, Peg>;
  regionId: RegionId;
  hover: string;
  setHover: (n: string) => void;
  selected: string;
  setSelected: (n: string) => void;
}) {
  const region = MAP_REGIONS.find((r) => r.id === regionId) ?? MAP_REGIONS[0];
  const layers: MapFeat[] = WORLD;

  return (
    <div
      className="relative overflow-hidden rounded-lg border"
      style={{ background: NAVY_DEEP, borderColor: NAVY_BORDER }}
    >
      <svg viewBox={region.vb} width="100%" role="img" aria-label={`World currency pegs map, ${region.label}`} style={{ display: "block", height: "auto", cursor: "default" }}>
        <rect x={0} y={0} width={1200} height={620} fill={NAVY_DEEP} />
        {layers.map((f) => {
          const paint = paintFor(f.n, pegByName);
          const isEuro = EURO_SET.has(f.n);
          const isSel = selected === f.n;
          const isHov = hover === f.n;
          const isExited = paint?.status === "Exited" && !isEuro;
          const isStressed = paint?.status === "Stressed";
          const isFloatingUnion = paint?.status === "Floating union";

          let fill = NAVY_PANEL;
          let stroke = NAVY_BORDER;
          let strokeWidth = 0.45;
          let fillOpacity = 1;
          let pattern = "";

          if (paint) {
            if (mode === "anc") {
              fill = ancFill(paint.anc);
            } else {
              const b = imfBucket(paint.peg, f.n);
              if (isEuro || isFloatingUnion) fill = COL_FLOAT;
              else fill = imfFill(b);
            }
            if (isFloatingUnion) fillOpacity = 0.55;
            if (isExited) fillOpacity = 0.35;
            if (isStressed && mode === "imf") {
              pattern = "url(#diagonal-hatch-stress)";
              fillOpacity = 0.95;
            }
            stroke = paint.dual ? "#facc15" : "#0a1020";
            strokeWidth = paint.dual ? 1 : 0.6;
          }

          if (isHov) {
            stroke = "#fbbf24";
            strokeWidth = 1.8;
          }
          if (isSel) {
            stroke = "#fef3c7";
            strokeWidth = 2.2;
          }

          return (
            <g key={f.n}>
              <path
                d={f.d}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ cursor: paint ? "pointer" : "default" }}
                onMouseEnter={() => setHover(f.n)}
                onMouseLeave={() => setHover("")}
                onClick={() => {
                  if (paint) setSelected(f.n === selected ? "" : f.n);
                }}
              >
                {pattern ? <title>{paint?.peg?.c ?? f.n}</title> : null}
              </path>
              {pattern && isStressed && mode === "imf" ? (
                <path d={f.d} fill={pattern} stroke="none" pointerEvents="none" />
              ) : null}
              {isStressed && mode === "imf" ? (
                <path d={f.d} fill="none" stroke="#dc2626" strokeWidth={1.4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" pointerEvents="none" />
              ) : null}
            </g>
          );
        })}
        {/* Small labels for point countries */}
        {MAP_POINTS.map((p) => {
          const paint = paintFor(p.n, pegByName);
          if (!paint) return null;
          const isHov = hover === p.n;
          return (
            <g key={`pt-${p.n}`} onMouseEnter={() => setHover(p.n)} onMouseLeave={() => setHover("")}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHov ? 4 : 3}
                fill={mode === "anc" ? ancFill(paint.anc) : imfFill(imfBucket(paint.peg, p.n))}
                stroke={isHov ? "#fbbf24" : "#0a1020"}
                strokeWidth={0.9}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(p.n === selected ? "" : p.n)}
              />
              <text
                x={p.x + 5}
                y={p.y + 3}
                fill={isHov ? "#fbbf24" : INK_MUTED}
                fontSize={6}
                style={{ pointerEvents: "none" }}
              >
                {p.n}
              </text>
            </g>
          );
        })}
        <defs>
          <pattern id="diagonal-hatch-stress" patternUnits="userSpaceOnUse" width={4} height={4} patternTransform="rotate(45)">
            <rect width={4} height={4} fill="transparent" />
            <line x1={0} y1={0} x2={0} y2={4} stroke="#dc2626" strokeWidth={1.2} />
          </pattern>
        </defs>
      </svg>
      {hover ? <HoverChip name={hover} paint={paintFor(hover, pegByName)} region={regionFor(hover)} /> : null}
    </div>
  );
}

function HoverChip({ name, paint, region }: { name: string; paint: ReturnType<typeof paintFor>; region: string }) {
  if (!paint) {
    return (
      <div className="pointer-events-none absolute right-3 top-3 max-w-[260px] rounded-md border px-3 py-2 text-xs" style={{ background: "rgba(15,22,41,0.92)", borderColor: NAVY_BORDER, color: INK_MUTED }}>
        <div className="font-semibold" style={{ color: INK }}>{name}</div>
        <div className="text-[11px]">{region} — no IMF peg row</div>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute right-3 top-3 max-w-[280px] rounded-md border px-3 py-2 text-xs shadow-xl" style={{ background: "rgba(10,16,32,0.95)", borderColor: NAVY_BORDER, color: INK }}>
      <div className="font-semibold">{paint.peg?.c ?? name}</div>
      <div className="text-[11px]" style={{ color: INK_MUTED }}>{region} · {paint.peg?.iso ?? ""}</div>
      <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-2">
        <span style={{ color: INK_DIM }}>Anchor</span>
        <span className="font-mono">{paint.anc}</span>
        <span style={{ color: INK_DIM }}>Rate</span>
        <span className="font-mono text-[11px]">{paint.rate}</span>
        <span style={{ color: INK_DIM }}>Kind</span>
        <span>{paint.peg?.imf ?? paint.kind}</span>
        <span style={{ color: INK_DIM }}>Status</span>
        <span style={{ color: paint.status === "Stressed" ? "#f97316" : paint.status === "Exited" ? "#ef4444" : INK }}>{paint.status}</span>
      </div>
    </div>
  );
}

function AncLegend() {
  const items = [
    { c: COL_USD, l: "USD anchor" },
    { c: COL_EUR, l: "EUR / DKK (incl. ERM II)" },
    { c: COL_GBP, l: "GBP anchor" },
    { c: COL_BASKET, l: "Basket (USD+EUR+others)" },
    { c: COL_OTHER, l: "Other / multi-anchor" },
    { c: COL_FLOAT, l: "Euro-area (floating bloc)" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs" style={{ color: INK_MUTED }}>
      {items.map((i) => (
        <span key={i.l} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: i.c, opacity: 0.95 }} />
          {i.l}
        </span>
      ))}
    </div>
  );
}

function ImfLegend() {
  const items = [
    { c: COL_NO_TENDER, l: "Hard: no separate legal tender" },
    { c: COL_BOARD, l: "Hard: currency board / quasi-board" },
    { c: COL_CONV, l: "Soft: conventional peg (stable)" },
    { c: COL_CRAWL, l: "Crawl / crawl-like" },
    { c: COL_DIRTY, l: "Stabilized / dirty float" },
    { c: COL_OTHER_IMF, l: "Other managed" },
    { c: COL_FLOAT, l: "Floating / floating union" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs" style={{ color: INK_MUTED }}>
      {items.map((i) => (
        <span key={i.l} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: i.c, opacity: 0.95 }} />
          {i.l}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm" style={{ background: COL_CRAWL, opacity: 0.5, border: "1px dashed #dc2626" }} />
        Stressed peg (hatch + red ring)
      </span>
    </div>
  );
}

function FilterChip({ label, value, options, onChange }: { label: string; value: string; options: { id: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: INK_DIM }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border px-1.5 py-0.5 text-xs"
        style={{ background: NAVY_BG, color: INK, borderColor: NAVY_BORDER }}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id} style={{ background: NAVY_BG }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DetailTable({ rows }: { rows: Peg[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("kind");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterAnchor, setFilterAnchor] = useState<string>("all");
  const [filterKind, setFilterKind] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRegion, setFilterRegion] = useState<string>("all");

  const sorted = useMemo(() => {
    const filt = rows.filter((r) => {
      if (filterAnchor !== "all" && r.anc !== filterAnchor) return false;
      if (filterKind !== "all" && r.kind !== filterKind) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterRegion !== "all" && r.region !== filterRegion) return false;
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filt].sort((a, b) => {
      const ka = sortKey;
      const va = a[ka as keyof Peg];
      const vb = b[ka as keyof Peg];
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      if (va == null && vb != null) return 1;
      if (va != null && vb == null) return -1;
      return String(va ?? "").localeCompare(String(vb ?? "")) * dir;
    });
  }, [rows, sortKey, sortDir, filterAnchor, filterKind, filterStatus, filterRegion]);

  const anchors = useMemo(() => {
    const set = new Set(rows.map((r) => r.anc));
    return Array.from(set).sort();
  }, [rows]);
  const kinds = ["Hard", "Soft", "Crawl", "Dirty", "Other"];
  const statuses = ["Intact", "Stressed", "Exited", "Floating union"];
  const regions = useMemo(() => {
    const set = new Set(rows.map((r) => r.region));
    return Array.from(set).sort();
  }, [rows]);

  function header(k: SortKey, label: string, align: "left" | "right" = "left") {
    return (
      <th
        className={`sticky top-0 cursor-pointer select-none px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${align === "right" ? "text-right" : "text-left"}`}
        style={{ color: INK_MUTED, background: NAVY_DEEP, borderBottom: `1px solid ${NAVY_BORDER}` }}
        onClick={() => {
          if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
          else {
            setSortKey(k);
            setSortDir("asc");
          }
        }}
      >
        {label}
        {sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
      </th>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterChip
          label="Anchor"
          value={filterAnchor}
          onChange={setFilterAnchor}
          options={[{ id: "all", label: "All" }, ...anchors.map((a) => ({ id: a, label: a }))]}
        />
        <FilterChip
          label="Kind"
          value={filterKind}
          onChange={setFilterKind}
          options={[{ id: "all", label: "All" }, ...kinds.map((k) => ({ id: k, label: k }))]}
        />
        <FilterChip
          label="Status"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[{ id: "all", label: "All" }, ...statuses.map((s) => ({ id: s, label: s }))]}
        />
        <FilterChip
          label="Region"
          value={filterRegion}
          onChange={setFilterRegion}
          options={[{ id: "all", label: "All" }, ...regions.map((r) => ({ id: r, label: r }))]}
        />
        <span className="ml-auto text-[11px]" style={{ color: INK_DIM }}>{sorted.length} rows</span>
      </div>
      <div className="max-h-[640px] overflow-auto rounded-md border" style={{ borderColor: NAVY_BORDER }}>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              {header("c", "Country")}
              {header("iso", "ISO")}
              {header("anc", "Anchor")}
              {header("kind", "Peg kind")}
              <th className="sticky top-0 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: INK_MUTED, background: NAVY_DEEP, borderBottom: `1px solid ${NAVY_BORDER}` }}>Rate</th>
              {header("since", "Since")}
              {header("vol", "5y vol", "right")}
              {header("status", "Status")}
              <th className="sticky top-0 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: INK_MUTED, background: NAVY_DEEP, borderBottom: `1px solid ${NAVY_BORDER}` }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, idx) => (
              <tr key={`${r.c}-${r.iso}-${idx}`} className="hover:bg-white/5">
                <td className="px-2 py-1.5" style={{ color: INK, borderBottom: `1px solid ${NAVY_BORDER}` }}>{r.c}</td>
                <td className="px-2 py-1.5 font-mono text-[11px]" style={{ color: INK_MUTED, borderBottom: `1px solid ${NAVY_BORDER}` }}>{r.iso}</td>
                <td className="px-2 py-1.5" style={{ borderBottom: `1px solid ${NAVY_BORDER}` }}>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-sm" style={{ background: ancFill(r.anc) }} />
                    {r.anc}
                  </span>
                </td>
                <td className="px-2 py-1.5" style={{ borderBottom: `1px solid ${NAVY_BORDER}` }}>
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      color: r.kind === "Hard" ? "#bfdbfe" : r.kind === "Soft" ? "#a5f3fc" : r.kind === "Crawl" ? "#fed7aa" : r.kind === "Dirty" ? "#fde68a" : "#cbd5e1",
                      background: r.kind === "Hard" ? "#1e3a8a" : r.kind === "Soft" ? "#155e75" : r.kind === "Crawl" ? "#7c2d12" : r.kind === "Dirty" ? "#78350f" : "#334155",
                    }}
                  >
                    {r.kind}
                  </span>
                </td>
                <td className="px-2 py-1.5 font-mono text-[11px]" style={{ color: INK, borderBottom: `1px solid ${NAVY_BORDER}` }}>{r.rate}</td>
                <td className="px-2 py-1.5 font-mono text-[11px]" style={{ color: INK_MUTED, borderBottom: `1px solid ${NAVY_BORDER}` }}>{r.since}</td>
                <td className="px-2 py-1.5 text-right font-mono text-[11px]" style={{ color: INK, borderBottom: `1px solid ${NAVY_BORDER}` }}>{volLabel(r)}</td>
                <td className="px-2 py-1.5" style={{ borderBottom: `1px solid ${NAVY_BORDER}` }}>
                  <span
                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{
                      color: r.status === "Intact" ? "#a7f3d0" : r.status === "Stressed" ? "#fdba74" : r.status === "Exited" ? "#fca5a5" : "#cbd5e1",
                      background: r.status === "Intact" ? "#064e3b" : r.status === "Stressed" ? "#7c2d12" : r.status === "Exited" ? "#7f1d1d" : "#1f2937",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-[11px]" style={{ color: INK_DIM, borderBottom: `1px solid ${NAVY_BORDER}` }} title={notesFromPeg(r)}>
                  {notesFromPeg(r)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MapCard({ title, subtitle, mode }: { title: string; subtitle: string; mode: MapMode }) {
  const pegByName = useMemo(() => buildPegByName(PEGS), []);
  const [regionId, setRegionId] = useState<RegionId>("world");
  const [hover, setHover] = useState<string>("");
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold" style={{ color: INK }}>{title}</h4>
          <p className="text-xs" style={{ color: INK_MUTED }}>{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label="Region"
            value={regionId}
            onChange={(v) => setRegionId(v as RegionId)}
            options={MAP_REGIONS.map((r) => ({ id: r.id, label: r.label }))}
          />
        </div>
      </div>
      <PegChoropleth
        mode={mode}
        pegByName={pegByName}
        regionId={regionId}
        hover={hover}
        setHover={setHover}
        selected={selected}
        setSelected={setSelected}
      />
      {mode === "anc" ? <AncLegend /> : <ImfLegend />}
    </div>
  );
}

export function WorldCurrencyPegs2026Dashboard() {
  return (
    <div className="flex flex-col gap-6" style={{ color: INK }}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-4 shadow-sm" style={{ background: NAVY_BG, borderColor: NAVY_BORDER }}>
          <MapCard
            title="Map 1 — Anchor currency"
            subtitle="Color by what each country pegs to. EUR / DKK (ERM II) = cyan; GBP = pink; Basket = purple."
            mode="anc"
          />
        </div>
        <div className="rounded-xl border p-4 shadow-sm" style={{ background: NAVY_BG, borderColor: NAVY_BORDER }}>
          <MapCard
            title="Map 2 — IMF de facto class"
            subtitle="Color by IMF AREAER 2023 de facto arrangement. Stressed pegs hatch + red ring. Euro-area = floating bloc."
            mode="imf"
          />
        </div>
      </div>
      <div className="rounded-xl border p-4 shadow-sm" style={{ background: NAVY_BG, borderColor: NAVY_BORDER }}>
        <h4 className="mb-1 text-base font-semibold" style={{ color: INK }}>Country table — full IMF AREAER 2023 universe</h4>
        <p className="mb-3 text-xs" style={{ color: INK_MUTED }}>
          {PEGS.length} rows. Sort by clicking any header; filter by anchor, kind, status, or region. 5y vol is annualized stdev of daily log returns vs the listed anchor, Sep 2021–Sep 2026.
        </p>
        <DetailTable rows={PEGS} />
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: INK_DIM }}>{SOURCE_NOTE}</p>
    </div>
  );
}