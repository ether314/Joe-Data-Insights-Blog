"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  FLEET_CLASS_COLORS,
  FLEET_COMPANIES,
  GLOBAL_SUMMARY,
  fmtFleet,
} from "@/data/last-mile-delivery-robotics-data";

const topFleet = [...FLEET_COMPANIES]
  .sort((a, b) => b.fleet - a.fleet)
  .slice(0, 5)
  .map((c) => ({
    name: c.name.split(" ")[0],
    fleet: c.fleet,
    fill: FLEET_CLASS_COLORS[c.fleetClass],
  }));

export function LastMileDeliveryRoboticsThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topFleet} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="fleet" radius={[2, 2, 0, 0]}>
              {topFleet.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Delivery robotics</p>
        <p className="mt-1 text-lg font-bold text-white">{fmtFleet(GLOBAL_SUMMARY.totalFleet)} robots tracked</p>
        <p className="mt-1 text-sm text-slate-300">
          {GLOBAL_SUMMARY.robovanSharePct}% Chinese robovans · {GLOBAL_SUMMARY.exitsCount} sector exits
        </p>
      </div>
    </div>
  );
}
