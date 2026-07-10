"use client";

import { STATS, fmtUsdT } from "@/data/china-fiscal-revenue";

/** Money & Chinese-themed card thumbnail — not data/chart styled */
export function ChinaFiscalRevenueThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-[#4a0707]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/finance-china-state-revenue-hero-v2.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505]/95 via-[#4a0707]/40 to-[#7c2d12]/20" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-4 top-4 text-[120px] font-bold leading-none text-amber-400/30">¥</div>
        <div className="absolute left-6 top-8 text-5xl text-amber-500/20">元</div>
      </div>
      <div className="relative z-10 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/90">China · State revenue</p>
        <p className="mt-1 text-lg font-bold leading-snug text-white">{fmtUsdT(STATS.totalUsdT)}</p>
        <p className="mt-1 text-sm text-amber-100/80">Four budgets · USD</p>
      </div>
    </div>
  );
}
