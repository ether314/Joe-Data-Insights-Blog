"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ELECTRICITY_MIX,
  MIX_COLORS,
  WORLD_GENERATION_TWH,
  fmtPct,
  fmtTwh,
} from "@/data/electricity-generation-mix-data";

const world = ELECTRICITY_MIX.find((r) => r.isoCode === "WLD");

const mixBars = world
  ? [
      { name: "Coal", pct: world.coalSharePct, fill: MIX_COLORS.coal },
      { name: "Gas", pct: world.gasSharePct, fill: MIX_COLORS.gas },
      { name: "Hydro", pct: world.hydroSharePct, fill: MIX_COLORS.hydro },
      { name: "Nuc", pct: world.nuclearSharePct, fill: MIX_COLORS.nuclear },
      { name: "Solar", pct: world.solarSharePct, fill: MIX_COLORS.solar },
      { name: "Wind", pct: world.windSharePct, fill: MIX_COLORS.wind },
    ]
  : [];

export function ElectricityGenerationMixThumbnail() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end bg-[#0f1629] p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mixBars} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 40]} />
            <Bar dataKey="pct" radius={[2, 2, 0, 0]}>
              {mixBars.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Energy mix</p>
        <p className="mt-1 text-lg font-bold text-white">{fmtTwh(WORLD_GENERATION_TWH)} global</p>
        <p className="mt-1 text-sm text-slate-300">
          Coal {fmtPct(world?.coalSharePct ?? 0)} · Low-carbon {fmtPct(world?.lowCarbonSharePct ?? 0)}
        </p>
      </div>
    </div>
  );
}
