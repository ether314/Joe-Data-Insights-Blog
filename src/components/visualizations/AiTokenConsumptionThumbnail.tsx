"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  GLOBAL_SUMMARY,
  JUNE_2026_SLICE,
  ORIGIN_COLORS,
  STATS,
} from "@/data/ai-token-consumption-data";

const juneBars = [...JUNE_2026_SLICE]
  .sort((a, b) => b.tokensTrillions - a.tokensTrillions)
  .slice(0, 7)
  .map((r) => ({
    name: r.brand.split(" ")[0].slice(0, 6),
    tokens: r.tokensTrillions,
    fill: ORIGIN_COLORS[r.origin],
  }));

export function AiTokenConsumptionThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={juneBars} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="tokens" radius={[2, 2, 0, 0]}>
              {juneBars.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Token volume</p>
        <p className="mt-1 text-lg font-bold text-white">{STATS.totalJun2026Label} / month</p>
        <p className="mt-1 text-sm text-slate-300">
          Jun 2026 · China {STATS.chinaShareLabel} vs US {STATS.usShareLabel} ·{" "}
          {GLOBAL_SUMMARY.brandCount} providers
        </p>
      </div>
    </div>
  );
}
