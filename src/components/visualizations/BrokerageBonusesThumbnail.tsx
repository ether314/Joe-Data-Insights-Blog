"use client";

import { PROGRAMS, STATS } from "@/data/referral-programs-data";

export function BrokerageBonusesThumbnail() {
  const preview = PROGRAMS.filter((p) => p.referrerCashUsdMax > 0)
    .sort((a, b) => b.referrerCashUsdMax - a.referrerCashUsdMax)
    .slice(0, 6);
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="space-y-1.5 p-3 pt-4">
          {preview.map((p) => (
            <div key={p.id} className="flex justify-between gap-2 text-[10px] text-slate-400">
              <span className="truncate">{p.company}</span>
              <span className="shrink-0 text-cyan-400/90">{p.referrerGetsHigh}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Referral programs</p>
        <p className="mt-1 text-lg font-bold text-white">{STATS.programCount} US finance programs</p>
        <p className="mt-1 text-sm text-slate-300">Banks · cards · investing · crypto</p>
      </div>
    </div>
  );
}
