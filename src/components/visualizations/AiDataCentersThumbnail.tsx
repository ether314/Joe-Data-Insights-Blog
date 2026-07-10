"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CHART_COLORS, SITES, STATS, fmtPower } from "@/data/ai-data-centers-data";

const topSites = [...SITES]
  .sort((a, b) => b.powerMw - a.powerMw)
  .slice(0, 6)
  .map((s) => ({
    name: s.site.split(" ")[0],
    mw: s.powerMw,
  }));

export function AiDataCentersThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topSites} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="mw" fill={CHART_COLORS.primary} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Build tracker</p>
        <p className="mt-1 text-lg font-bold text-white">{STATS.siteCount} AI megaprojects</p>
        <p className="mt-1 text-sm text-slate-300">{STATS.totalPowerLabel} planned IT load</p>
      </div>
    </div>
  );
}
