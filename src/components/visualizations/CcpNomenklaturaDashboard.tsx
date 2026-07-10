"use client";

import { useMemo, useState } from "react";
import {
  HIERARCHY_EDGES,
  HIERARCHY_NODES,
  type ExpandableDept,
  type NodePanelData,
  formatHeadcount,
  formatTotalUsd,
  getNodePanelData,
  sumDeptBudgetUsdB,
  sumDeptHeadcount,
} from "@/data/ccp-nomenklatura-trees";
import {
  HIERARCHY_VIEWBOX,
  LAYER_COLORS,
  NODE_HEIGHT,
  NODE_LAYOUT,
  NODE_WIDTH,
  nodeById,
} from "@/data/ccp-nomenklatura-data";
import { rosterForNode, type MemberTenure, type RosterMember } from "@/data/ccp-member-roster";

const TENURE_BADGE: Record<MemberTenure, string> = {
  returning: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  new: "bg-slate-100 text-slate-700 ring-slate-200",
  promoted: "bg-cyan-100 text-cyan-800 ring-cyan-200",
  expelled: "bg-red-100 text-red-800 ring-red-200",
  resigned: "bg-orange-100 text-orange-800 ring-orange-200",
  investigation: "bg-amber-100 text-amber-900 ring-amber-200",
  delegate: "bg-slate-100 text-slate-600 ring-slate-200",
  "cc-full": "bg-indigo-100 text-indigo-800 ring-indigo-200",
  "cc-alt": "bg-violet-100 text-violet-800 ring-violet-200",
  presidium: "bg-purple-100 text-purple-800 ring-purple-200",
};

const PAGE_SIZE = 50;

function MemberRosterTable({
  nodeId,
  nodeOffice,
  members,
}: {
  nodeId: string;
  nodeOffice: string;
  members: RosterMember[];
}) {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<"all" | "full" | "alternate" | "highlight">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (groupFilter === "full" && m.group !== "full") return false;
      if (groupFilter === "alternate" && m.group !== "alternate") return false;
      if (groupFilter === "highlight") {
        if (nodeId === "nc") {
          return (
            m.tenure === "cc-full" ||
            m.tenure === "cc-alt" ||
            m.tenure === "presidium" ||
            m.tenure === "expelled" ||
            m.tenure === "resigned" ||
            m.tenure === "investigation"
          );
        }
        return m.tenure !== "new";
      }
      if (!q) return true;
      return m.display.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.remark.toLowerCase().includes(q);
    });
  }, [members, query, groupFilter, nodeId]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const title =
    nodeId === "cc"
      ? `Central Committee members (${members.length})`
      : `20th Congress delegates (${members.length})`;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {nodeId === "cc"
            ? "All 205 full and 171 alternate members elected Oct 2022, with returning vs new status and notable remarks (expulsions, promotions, provincial posts)."
            : "Complete official delegate list (Xinhua, Sept 2022). CC members, alternates, and presidium leaders are tagged."}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder={`Search ${nodeOffice} names or remarks…`}
          className="w-full min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm sm:max-w-xs"
          aria-label="Search members"
        />
        {nodeId === "cc" ? (
          <select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value as typeof groupFilter);
              setPage(0);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            aria-label="Filter by member type"
          >
            <option value="all">All members</option>
            <option value="full">Full members only (205)</option>
            <option value="alternate">Alternates only (171)</option>
            <option value="highlight">Notable only (expelled, PSC, promoted…)</option>
          </select>
        ) : (
          <select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value as typeof groupFilter);
              setPage(0);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            aria-label="Filter delegates"
          >
            <option value="all">All delegates</option>
            <option value="highlight">CC / presidium / notable only</option>
          </select>
        )}
        <span className="text-xs text-slate-500">
          Showing {filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–
          {Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-10 px-3 py-3">#</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No members match your search.
                </td>
              </tr>
            ) : (
              slice.map((m, i) => (
                <tr key={`${m.display}-${safePage}-${i}`} className={i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{safePage * PAGE_SIZE + i + 1}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{m.display}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TENURE_BADGE[m.tenure]}`}
                    >
                      {m.tenureLabel}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 leading-snug">{m.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {safePage + 1} of {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function HierarchyDiagram({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const nodes = HIERARCHY_NODES.filter((n) => NODE_LAYOUT[n.id]);

  function edgePath(from: string, to: string) {
    const a = NODE_LAYOUT[from];
    const b = NODE_LAYOUT[to];
    if (!a || !b) return "";
    const x1 = a.x + NODE_WIDTH / 2;
    const y1 = a.y + NODE_HEIGHT;
    const x2 = b.x + NODE_WIDTH / 2;
    const y2 = b.y;
    const midY = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-x-auto rounded-lg border-2 border-dashed border-cyan-300 bg-cyan-50/40 p-3">
        <svg
          viewBox={HIERARCHY_VIEWBOX}
          className="mx-auto h-[280px] w-full min-w-[640px] sm:h-[320px]"
          role="img"
          aria-label="CCP party-state hierarchy — click a node to explore"
        >
          {HIERARCHY_EDGES.map((e) => (
            <path
              key={`${e.from}-${e.to}`}
              d={edgePath(e.from, e.to)}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1}
            />
          ))}
          {nodes.map((node) => {
            const pos = NODE_LAYOUT[node.id]!;
            const selected = node.id === selectedId;
            const fill = node.layer === "psc" ? LAYER_COLORS.psc : "#ffffff";
            const textColor = node.layer === "psc" ? "#fff" : "#0f172a";
            return (
              <g
                key={node.id}
                onClick={() => onSelect(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(node.id);
                }}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                aria-pressed={selected}
                aria-label={`${node.office} — click to view departments`}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  fill={fill}
                  stroke={selected ? "#0891b2" : LAYER_COLORS[node.layer]}
                  strokeWidth={selected ? 2.5 : 1.5}
                  rx={4}
                  className={selected ? undefined : "hover:opacity-90"}
                />
                <text
                  x={pos.x + NODE_WIDTH / 2}
                  y={pos.y + 22}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={10}
                  fontWeight={600}
                >
                  {node.office.length > 20 ? `${node.office.slice(0, 18)}…` : node.office}
                </text>
                <text
                  x={pos.x + NODE_WIDTH / 2}
                  y={pos.y + 38}
                  textAnchor="middle"
                  fill={node.layer === "psc" ? "#fecaca" : "#64748b"}
                  fontSize={9}
                >
                  {node.incumbent.length > 22 ? `${node.incumbent.slice(0, 20)}…` : node.incumbent}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function countSubUnits(dept: ExpandableDept): number {
  if (!dept.children?.length) return 0;
  return dept.children.reduce((n, c) => n + 1 + countSubUnits(c), 0);
}

function ExpandableDeptTree({
  depts,
  defaultExpandedIds,
  highlightSOE,
}: {
  depts: ExpandableDept[];
  defaultExpandedIds: string[];
  highlightSOE: boolean;
}) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpandedIds);

  function toggle(id: string) {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function renderDept(dept: ExpandableDept, depth: number) {
    const hasChildren = Boolean(dept.children?.length);
    const isOpen = expanded.includes(dept.id);
    const isSOE = Boolean(dept.isSOE);
    const subCount = hasChildren ? countSubUnits(dept) : 0;

    return (
      <div key={dept.id}>
        <div
          role={hasChildren ? "button" : undefined}
          tabIndex={hasChildren ? 0 : undefined}
          onClick={hasChildren ? () => toggle(dept.id) : undefined}
          onKeyDown={
            hasChildren
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") toggle(dept.id);
                }
              : undefined
          }
          className={`grid grid-cols-[28px_1fr_88px_88px] items-start gap-2 border-b border-slate-100 px-3 py-2.5 ${
            hasChildren ? "cursor-pointer hover:bg-amber-50/80" : ""
          } ${isOpen ? "bg-amber-50/50" : ""} ${
            hasChildren && !isOpen ? "ring-1 ring-inset ring-amber-200/60" : ""
          } ${isSOE && highlightSOE ? "border-l-[3px] border-l-cyan-500 bg-cyan-50/30" : ""}`}
          style={{ paddingLeft: 12 + depth * 14 }}
          aria-expanded={hasChildren ? isOpen : undefined}
        >
          {hasChildren ? (
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                isOpen
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-amber-400 bg-amber-100 text-amber-800"
              }`}
              aria-hidden
            >
              {isOpen ? "▾" : "▸"}
            </span>
          ) : (
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-xs text-slate-300">
              ·
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{dept.name}</span>
              {hasChildren && !isOpen && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                  Click to drill down · {subCount} sub-units
                </span>
              )}
              {hasChildren && isOpen && (
                <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-800">
                  Expanded — click ▸ to collapse
                </span>
              )}
              {isSOE && highlightSOE && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                  SOE
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-snug text-slate-600">
              {dept.head !== "—" ? `${dept.head} · ` : ""}
              {dept.function}
            </p>
            {dept.reportsTo && (
              <p className="mt-1 text-xs text-slate-400">Reports to: {dept.reportsTo}</p>
            )}
            {isOpen && dept.employeeNote && (
              <p className="mt-1 text-xs italic text-slate-400">{dept.employeeNote}</p>
            )}
            {isOpen && dept.budgetNote && (
              <p className="mt-1 text-xs italic text-slate-400">{dept.budgetNote}</p>
            )}
          </div>
          <div className="text-right text-sm font-semibold text-slate-800">{dept.employees ?? "ND"}</div>
          <div className="text-right text-sm font-semibold text-slate-800">{dept.budget ?? "—"}</div>
        </div>
        {hasChildren && isOpen && dept.children!.map((c) => renderDept(c, depth + 1))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <div className="grid grid-cols-[28px_1fr_88px_88px] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-center">▸</span>
        <span>Department</span>
        <span className="text-right">Employees</span>
        <span className="text-right">Budget (2025 USD)</span>
      </div>
      {depts.map((d) => renderDept(d, 0))}
    </div>
  );
}

function LeadershipTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-slate-900">{title}</h4>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-slate-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DepartmentsPanel({ panel, nodeOffice }: { panel: NodePanelData; nodeOffice: string }) {
  const totalEmployees = formatHeadcount(sumDeptHeadcount(panel.depts));
  const totalBudget = formatTotalUsd(sumDeptBudgetUsdB(panel.depts));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Departments under {nodeOffice}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{panel.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total employees (est.)</p>
          <p className="mt-1 text-xl font-bold text-cyan-700">{totalEmployees}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total budget (2025 USD est.)</p>
          <p className="mt-1 text-xl font-bold text-cyan-700">{totalBudget}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {panel.thirdStatLabel ?? "Units listed"}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">{panel.thirdStatValue ?? panel.depts.length}</p>
        </div>
      </div>

      {panel.leadershipTitle && panel.leadershipHeaders && panel.leadershipRows && (
        <LeadershipTable
          title={panel.leadershipTitle}
          headers={panel.leadershipHeaders}
          rows={panel.leadershipRows}
        />
      )}

      <ExpandableDeptTree
        depts={panel.depts}
        defaultExpandedIds={panel.defaultExpandedIds}
        highlightSOE={panel.highlightSOE}
      />
    </div>
  );
}

function ClickPrompt() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <p className="text-3xl leading-none text-slate-400" aria-hidden>
        ↑
      </p>
      <p className="text-base font-bold text-slate-700">Click an organ in the diagram above</p>
      <p className="max-w-md text-sm text-slate-500">
        Select National Congress, Central Committee, Politburo, PSC, State Council, NPC, CMC, or any
        other node to load departments with headcount and budget data here.
      </p>
    </div>
  );
}

export function CcpNomenklaturaDashboard() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? nodeById(selectedNodeId) : undefined;
  const panel = useMemo(
    () => (selectedNodeId ? getNodePanelData(selectedNodeId) : null),
    [selectedNodeId],
  );
  const roster = useMemo(
    () => (selectedNodeId ? rosterForNode(selectedNodeId) : null),
    [selectedNodeId],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-4 sm:p-5">
        <div className="text-center">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Party-state hierarchy</h3>
        </div>

        <HierarchyDiagram selectedId={selectedNodeId} onSelect={setSelectedNodeId} />

        {selectedNode && panel ? (
          <>
            <div className="flex items-center justify-center gap-2 text-cyan-600">
              <span className="text-lg font-bold" aria-hidden>
                ↓
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide">Details for selected organ</span>
              <span className="text-lg font-bold" aria-hidden>
                ↓
              </span>
            </div>

            <div className="rounded-lg border border-cyan-200 bg-cyan-50/50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: LAYER_COLORS[selectedNode.layer] }}
                />
                <span className="font-semibold text-slate-900">{selectedNode.office}</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {selectedNode.incumbent}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-600">{selectedNode.summary}</p>
            </div>

            {roster && (
              <MemberRosterTable
                nodeId={selectedNodeId!}
                nodeOffice={selectedNode.office}
                members={roster}
              />
            )}

            <DepartmentsPanel panel={panel} nodeOffice={selectedNode.office} />
          </>
        ) : (
          <ClickPrompt />
        )}
      </div>
    </div>
  );
}
