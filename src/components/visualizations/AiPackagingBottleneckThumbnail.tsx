"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  BOTTLENECK_COLORS,
  HBM_SUPPLIERS,
  STATS,
  fmtPct,
} from "@/data/ai-packaging-bottleneck-data";

const hbmBars = HBM_SUPPLIERS.map((r, i) => ({
  name: r.entity.split(" ")[0].slice(0, 4),
  share: r.value,
  fill: [BOTTLENECK_COLORS.hbm, "#6366f1", "#22c55e"][i % 3],
}));

export function AiPackagingBottleneckThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hbmBars} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="share" radius={[2, 2, 0, 0]}>
              {hbmBars.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">HBM + CoWoS</p>
        <p className="mt-1 text-lg font-bold text-white">{STATS.hbmMarketLabel} HBM market</p>
        <p className="mt-1 text-sm text-slate-300">
          CoWoS {STATS.cowosCapacityLabel} · SK hynix {fmtPct(52.3)}
        </p>
      </div>
    </div>
  );
}
