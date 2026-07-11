"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  GLOBAL_SUMMARY,
  INCOME_COLORS,
  TOP_HOSTS,
  fmtCount,
  fmtPct,
} from "@/data/refugee-hosting-burden-data";

const topBars = TOP_HOSTS.slice(0, 5).map((r) => ({
  name: r.country.slice(0, 3),
  count: r.hostedCount,
  fill: INCOME_COLORS[r.incomeLevel],
}));

const topHost = TOP_HOSTS[0];

export function RefugeeHostingBurdenThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topBars} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {topBars.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Refugee hosting</p>
        <p className="mt-1 text-lg font-bold text-white">
          {topHost ? fmtCount(topHost.hostedCount) : "—"} top host
        </p>
        <p className="mt-1 text-sm text-slate-300">
          {fmtPct(GLOBAL_SUMMARY.lowAndMiddleIncomeSharePct, 0)} in LMIC · 25 countries
        </p>
      </div>
    </div>
  );
}
