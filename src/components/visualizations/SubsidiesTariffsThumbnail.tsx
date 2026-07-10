"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { CHART_COLORS, SUBSIDY_DATA, SUBSIDY_LAST, fmtB } from "@/data/subsidies-tariffs-data";

const sparkData = SUBSIDY_DATA.filter(
  (_, i) => i % 2 === 0 || i === SUBSIDY_DATA.length - 1,
).map((d) => ({
  year: d.year,
  support: d.totalSupport,
  tariffs: d.tariffRevenue,
}));

export function SubsidiesTariffsThumbnail() {
  return (
    <div className="relative h-full w-full bg-[#0f1629] p-4">
      <div className="absolute inset-0 opacity-25">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <YAxis hide domain={["auto", "auto"]} />
            <Line
              type="monotone"
              dataKey="support"
              stroke={CHART_COLORS.support}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="tariffs"
              stroke={CHART_COLORS.tariffs}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Interactive analysis</p>
        <p className="mt-1 text-lg font-bold text-white">1996 → 2025</p>
        <p className="mt-1 text-sm text-slate-300">
          Support {fmtB(SUBSIDY_LAST.totalSupport)} · Tariffs {fmtB(SUBSIDY_LAST.tariffRevenue)}
        </p>
      </div>
    </div>
  );
}
