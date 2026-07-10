"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  comparePrograms,
  defaultSortDir,
  PROGRAMS,
  REWARD_TYPES,
  STATS,
  STATUSES,
  type CategoryFilter,
  type ReferralProgram,
  type RewardTypeFilter,
  type SortDir,
  type SortKey,
  type StatusFilter,
} from "@/data/referral-programs-data";

const MONEY_POSITIVE = "#16a34a";
const MONEY_NEGATIVE = "#dc2626";

const COL_WIDTHS = [
  "9%", // company
  "5%", // you low
  "5%", // you high
  "5%", // they low
  "5%", // they high
  "5%", // cost
  "5%", // net
  "8%", // category
  "5%", // reward
  "16%", // tiers
  "14%", // requirements
  "8%", // cap
  "5%", // status
] as const;

function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`w-full whitespace-normal break-words text-left text-[10px] font-semibold leading-tight transition-colors ${
        active ? "text-cyan-700" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
      {active ? (dir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );
}

function MoneyCell({
  text,
  usd,
  forceNegative = false,
}: {
  text: string;
  usd: number;
  forceNegative?: boolean;
}) {
  if (forceNegative || usd < 0) {
    return <span style={{ color: MONEY_NEGATIVE, fontWeight: 500 }}>{text}</span>;
  }
  if (usd > 0) {
    return <span style={{ color: MONEY_POSITIVE, fontWeight: 500 }}>{text}</span>;
  }
  return <span className="text-slate-600">{text}</span>;
}

function StatusPill({ status }: { status: ReferralProgram["status"] }) {
  const styles =
    status === "Active"
      ? "bg-emerald-100 text-emerald-800"
      : status === "Expired"
        ? "bg-slate-100 text-slate-600"
        : "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-flex rounded px-1 py-0.5 text-[10px] font-semibold leading-tight ${styles}`}>
      {status}
    </span>
  );
}

function WrapCell({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <td
      className={`whitespace-normal break-words px-1 py-1 align-top text-[11px] leading-snug ${
        bold ? "font-semibold text-slate-900" : "text-slate-600"
      }`}
    >
      {children}
    </td>
  );
}

export function BrokerageBonusesDashboard() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [rewardType, setRewardType] = useState<RewardTypeFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("youHigh");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(defaultSortDir(key));
    }
  }

  const sorted = useMemo(() => {
    const filtered = PROGRAMS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (status !== "All" && p.status !== status) return false;
      if (rewardType !== "All" && p.rewardType !== rewardType) return false;
      return true;
    });
    const sign = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * comparePrograms(a, b, sortKey));
  }, [category, status, rewardType, sortKey, sortDir]);

  const selectClass =
    "rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-200";

  return (
    <div className="site-content flex h-full min-h-0 w-full flex-col gap-2">
      <div className="flex shrink-0 flex-wrap items-end gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          <span>
            <strong className="text-slate-900">{STATS.programCount}</strong> programs
          </span>
          <span>
            <strong className="text-slate-900">{STATS.withReferrerPayout}</strong> w/ payout
          </span>
          <span>
            <strong className="text-slate-900">{STATS.activeWithPayout}</strong> active
          </span>
          <span>
            <strong className="text-slate-900">{STATS.categoryCount}</strong> categories
          </span>
          <span className="text-slate-400">· June 26, 2026</span>
        </div>

        <div className="flex flex-wrap items-end gap-2 sm:ml-auto">
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
              className={`${selectClass} min-w-[140px]`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Reward
            </span>
            <select
              value={rewardType}
              onChange={(e) => setRewardType(e.target.value as RewardTypeFilter)}
              className={`${selectClass} min-w-[110px]`}
            >
              {REWARD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className={`${selectClass} min-w-[90px]`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="shrink-0 text-xs text-slate-500">
        Showing {sorted.length} of {STATS.programCount} programs
      </p>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed text-[11px]">
            <colgroup>
              {COL_WIDTHS.map((w, i) => (
                <col key={i} style={{ width: w }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr>
                {(
                  [
                    ["Company", "company"],
                    ["You (low)", "youLow"],
                    ["You (high)", "youHigh"],
                    ["They (low)", "theyLow"],
                    ["They (high)", "theyHigh"],
                    ["Annual cost", "cost"],
                    ["Net value", "net"],
                    ["Category", "category"],
                    ["Reward", "reward"],
                    ["Payout tiers", "tiers"],
                    ["Requirements", "must"],
                    ["Referral cap", "cap"],
                    ["Status", "status"],
                  ] as const
                ).map(([label, key]) => (
                  <th key={key} className="px-1 py-1.5 align-top">
                    <SortHeader
                      label={label}
                      sortKey={key}
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((p) => (
                <tr key={p.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/30">
                  <WrapCell bold>{p.company}</WrapCell>
                  <WrapCell>
                    <MoneyCell text={p.referrerGetsLow} usd={p.referrerCashUsdMin} />
                  </WrapCell>
                  <WrapCell>
                    <MoneyCell text={p.referrerGetsHigh} usd={p.referrerCashUsdMax} />
                  </WrapCell>
                  <WrapCell>
                    <MoneyCell text={p.refereeGetsLow} usd={p.refereeCashUsdMin} />
                  </WrapCell>
                  <WrapCell>
                    <MoneyCell text={p.refereeGetsHigh} usd={p.refereeCashUsdMax} />
                  </WrapCell>
                  <WrapCell>
                    <MoneyCell text={p.annualCost} usd={p.annualCostUsd} forceNegative />
                  </WrapCell>
                  <WrapCell>
                    <MoneyCell text={p.estNetValue} usd={p.estNetUsd} />
                  </WrapCell>
                  <WrapCell>{p.category}</WrapCell>
                  <WrapCell>{p.rewardType}</WrapCell>
                  <WrapCell>{p.depositTiers}</WrapCell>
                  <WrapCell>{p.refereeMust}</WrapCell>
                  <WrapCell>{p.referrerCap}</WrapCell>
                  <WrapCell>
                    <StatusPill status={p.status} />
                  </WrapCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className="shrink-0 rounded border border-sky-200 bg-sky-50 text-xs text-sky-900">
        <summary className="cursor-pointer px-3 py-1.5 font-semibold text-sky-800">
          Notes &amp; methodology
        </summary>
        <div className="space-y-2 border-t border-sky-200 px-3 py-2 leading-relaxed text-sky-800">
          <p>
            <strong>Point &amp; mile valuations:</strong> Est. value uses typical cpp: MR/UR/Delta/United
            ~1.2–1.7¢; Southwest ~1.4¢; Marriott ~0.7¢; Hilton ~0.5¢; Cap1 miles ~1.0¢; Bilt ~2.0¢;
            cash at face value. Card offers are YMMV — check your issuer portal.
          </p>
          <p>
            <strong>Credit card highlights:</strong> Top referrer value: Amex Platinum/Gold (15k–45k
            MR), Chase Sapphire (15k UR), Cap1 Venture X (25k miles), Chase Marriott (40k pts). No
            public program: Wells Fargo, US Bank, Apple Card. Citi/Barclays targeted only.
          </p>
          <p>
            <strong>Annual product cost:</strong> Est. yearly cost to keep the product: card annual
            fees, subscriptions, bank maintenance (often $0 w/ direct deposit). Net value = They get
            (low) − annual cost. Click a column header to sort.
          </p>
        </div>
      </details>
    </div>
  );
}
