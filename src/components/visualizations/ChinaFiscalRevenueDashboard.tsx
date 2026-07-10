"use client";

import { useState } from "react";
import {
  ALL_REVENUE_TOTAL,
  ALL_REVENUE_USD_T,
  BUDGET_BAR_COLORS,
  BUDGET_LABELS,
  BUDGET_LEGEND_ORDER,
  BUDGET_OFFICIAL_TOTALS,
  FX_LABEL,
  USD_YEAR,
  cny100mToUsdB,
  cny100mToUsdT,
  fmtUsdB,
  fmtUsdT,
  GRANULAR_CHART_ITEMS,
  GRANULAR_CHART_SUM,
  STATS,
  type BudgetKey,
  type GranularChartRow,
} from "@/data/china-fiscal-revenue";

function BudgetSwatch({ budget }: { budget: BudgetKey }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-sm ring-1 ring-slate-200"
      style={{ backgroundColor: BUDGET_BAR_COLORS[budget] }}
    />
  );
}

function SummaryBar() {
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
        <span>Combined scale (all 4 budgets)</span>
        <span className="font-semibold text-slate-700">{fmtUsdT(ALL_REVENUE_USD_T)}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        {BUDGET_LEGEND_ORDER.map((budget) => (
          <div
            key={budget}
            style={{
              width: `${(BUDGET_OFFICIAL_TOTALS[budget] / ALL_REVENUE_TOTAL) * 100}%`,
              backgroundColor: BUDGET_BAR_COLORS[budget],
            }}
            title={BUDGET_LABELS[budget]}
          />
        ))}
      </div>
    </div>
  );
}

function RevenueRow({
  item,
  active,
  onHover,
}: {
  item: GranularChartRow;
  active: boolean;
  onHover: () => void;
}) {
  const widthPct = (item.cny100m / ALL_REVENUE_TOTAL) * 100;
  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`flex cursor-default items-center gap-2 rounded px-1.5 py-1.5 transition ${
        active ? "bg-cyan-50 ring-1 ring-cyan-200" : "hover:bg-slate-50"
      }`}
    >
      <div className="w-[min(28vw,140px)] shrink-0 truncate text-[9px] leading-tight text-slate-800 sm:w-[168px] sm:text-[10px]">
        {item.label}
      </div>
      <div className="relative min-w-[48px] flex-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${widthPct}%`, backgroundColor: BUDGET_BAR_COLORS[item.budget] }}
          />
        </div>
      </div>
      <div className="w-[52px] shrink-0 text-right text-[9px] tabular-nums leading-tight text-slate-500 sm:w-[60px]">
        {fmtUsdB(item.usdB).replace(` ${USD_YEAR}`, "")}
      </div>
      <div className="hidden w-[36px] shrink-0 text-right text-[9px] tabular-nums text-slate-400 md:block">
        {item.pctOfTotal.toFixed(1)}%
      </div>
    </div>
  );
}

function DetailPanel({ item, compact = false }: { item: GranularChartRow; compact?: boolean }) {
  return (
    <div className={`flex flex-col ${compact ? "gap-1.5" : "h-full"}`}>
      <div className="flex items-start gap-1.5">
        <BudgetSwatch budget={item.budget} />
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            {BUDGET_LABELS[item.budget]}
          </p>
          <h3 className={`font-bold leading-snug text-slate-900 ${compact ? "text-[11px]" : "text-xs"}`}>
            {item.label}
          </h3>
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-1.5 ${compact ? "text-[9px]" : "text-[10px]"}`}>
        <div className="rounded bg-slate-50 px-2 py-1">
          <p className="text-slate-500">{USD_YEAR}</p>
          <p className="font-bold text-slate-900">{fmtUsdB(item.usdB)}</p>
        </div>
        <div className="rounded bg-slate-50 px-2 py-1">
          <p className="text-slate-500">Share</p>
          <p className="font-bold text-slate-900">{item.pctOfTotal.toFixed(2)}%</p>
        </div>
        <div className="rounded bg-slate-50 px-2 py-1">
          <p className="truncate text-slate-500">{item.splitLeft}</p>
          <p className="font-semibold text-slate-800">{fmtUsdB(cny100mToUsdB(item.central))}</p>
        </div>
        <div className="rounded bg-slate-50 px-2 py-1">
          <p className="truncate text-slate-500">{item.splitRight}</p>
          <p className="font-semibold text-slate-800">{fmtUsdB(cny100mToUsdB(item.local))}</p>
        </div>
      </div>
      <p className={`leading-snug text-slate-600 ${compact ? "line-clamp-4 text-[10px]" : "flex-1 text-[11px]"}`}>
        {item.commentary}
      </p>
    </div>
  );
}

export function ChinaFiscalRevenueDashboard({ embedded = false }: { embedded?: boolean }) {
  const [active, setActive] = useState(GRANULAR_CHART_ITEMS[0]);

  const shellClass = embedded
    ? "flex max-h-[min(480px,55vh)] min-h-[300px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    : "flex h-full min-h-0 flex-col";

  return (
    <div className={shellClass}>
      <div className="shrink-0 border-b border-slate-200 bg-white px-2 py-2 sm:px-3">
        <h2 className="text-xs font-bold text-slate-900 sm:text-sm">
          Granular Revenue by Line Item — All 4 Budgets ({fmtUsdT(STATS.totalUsdT)} total)
        </h2>
        <p className="mt-0.5 text-[10px] text-slate-500">
          {STATS.lineItems} lines · {USD_YEAR} · hover for commentary
        </p>
        <div className="mt-2">
          <SummaryBar />
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] text-slate-600">
            {BUDGET_LEGEND_ORDER.map((budget) => (
              <span key={budget} className="inline-flex items-center gap-1">
                <BudgetSwatch budget={budget} />
                {fmtUsdB(cny100mToUsdB(BUDGET_OFFICIAL_TOTALS[budget])).replace(` ${USD_YEAR}`, "")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto_auto] gap-1.5 border-b border-slate-100 px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
            <span>Line item</span>
            <span className="hidden sm:inline">Amount</span>
            <span className="sm:hidden">Amt</span>
            <span className="hidden md:inline">%</span>
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-1 py-1 sm:px-1.5">
            {GRANULAR_CHART_ITEMS.map((item) => (
              <RevenueRow
                key={item.label}
                item={item}
                active={active.label === item.label}
                onHover={() => setActive(item)}
              />
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50/80 p-2 lg:block lg:w-56 xl:w-64">
          <DetailPanel item={active} />
        </div>

        {!embedded && (
          <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-2 lg:hidden">
            <DetailPanel item={active} compact />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-2 py-1 text-[9px] text-slate-500 sm:px-3">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span>{STATS.lineItems} items · {fmtUsdT(cny100mToUsdT(GRANULAR_CHART_SUM))}</span>
          <span className="font-medium text-slate-600">{FX_LABEL} · excludes bond proceeds</span>
        </div>
      </div>
    </div>
  );
}
