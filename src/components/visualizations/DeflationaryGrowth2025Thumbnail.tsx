"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  DEFLATIONARY_GROWTH,
  GLOBAL_SUMMARY,
  REGION_COLORS,
  STATS,
  fmtPct,
} from "@/data/deflationary-growth-2025-data";

const topGdp = [...DEFLATIONARY_GROWTH]
  .sort((a, b) => b.gdpGrowthPct2025 - a.gdpGrowthPct2025)
  .slice(0, 6)
  .map((r) => ({
    name: r.iso3,
    gdp: r.gdpGrowthPct2025,
    fill: REGION_COLORS[r.region] ?? "#64748b",
  }));

export function DeflationaryGrowth2025Thumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topGdp} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="gdp" radius={[2, 2, 0, 0]}>
              {topGdp.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Deflationary growth</p>
        <p className="mt-1 text-lg font-bold text-white">{STATS.recordCount} economies · {STATS.dataYear}</p>
        <p className="mt-1 text-sm text-slate-300">
          {STATS.avgGdpLabel} GDP · {STATS.avgCpiLabel} CPI · {GLOBAL_SUMMARY.fastestGdp.economy} fastest
        </p>
      </div>
    </div>
  );
}
