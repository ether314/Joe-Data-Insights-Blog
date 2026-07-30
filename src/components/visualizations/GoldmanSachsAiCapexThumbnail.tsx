"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  COMPUTE_BN,
  DATACENTERS_BN,
  HEADLINE,
  LAYER_COLORS,
  YEARS,
  fmtBn,
} from "@/data/goldman-sachs-ai-capex-data";

export function GoldmanSachsAiCapexThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={YEARS.map((y, i) => ({ year: y.slice(2), total: COMPUTE_BN[i] + DATACENTERS_BN[i] }))}
            margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="total" fill={LAYER_COLORS.compute} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Goldman Sachs AI capex</p>
        <p className="mt-1 text-lg font-bold text-white">{fmtBn(HEADLINE.y2027.chipsPlusDc)} in 2027</p>
        <p className="mt-1 text-sm text-slate-300">
          {fmtBn(HEADLINE.y2028.chipsPlusDc)} in 2028 · chips + data centers
        </p>
      </div>
    </div>
  );
}
