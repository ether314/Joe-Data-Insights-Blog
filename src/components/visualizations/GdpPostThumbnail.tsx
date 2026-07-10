"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { CHART_COLORS, fmtT, GDP_DATA, GDP_LAST } from "@/data/gdp-analysis-data";

const sparkData = GDP_DATA.filter((_, i) => i % 2 === 0 || i === GDP_DATA.length - 1).map((d) => ({
  year: d.year,
  US: d.usGdp / 1000,
  China: d.chinaGdp / 1000,
  India: d.indiaGdp / 1000,
}));

export function GdpPostThumbnail() {
  return (
    <div className="relative h-full w-full bg-[#0f1629] p-4">
      <div className="absolute inset-0 opacity-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <YAxis hide domain={["auto", "auto"]} />
            <Line type="monotone" dataKey="US" stroke={CHART_COLORS.us} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="China" stroke={CHART_COLORS.china} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="India" stroke={CHART_COLORS.india} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Interactive analysis</p>
        <p className="mt-1 text-lg font-bold text-white">1995 → 2026</p>
        <p className="mt-1 text-sm text-slate-300">China {fmtT(GDP_LAST.chinaGdp)} · US {fmtT(GDP_LAST.usGdp)}</p>
      </div>
    </div>
  );
}
