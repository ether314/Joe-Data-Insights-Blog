"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { gapChartNote } from "@/data/gdp-commentary";
import { CHART_COLORS, fmtPct } from "@/data/gdp-analysis-data";

export type GapCompare = "us" | "india";

export type GrowthGapPoint = {
  year: number;
  gap: number;
  chinaYoY: number;
  compareYoY: number;
};

function fmtPp(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)} pp`;
}

function lineChartAxisBounds(values: number[]): { yMin: number; yMax: number } {
  const padFrac = 0.08;
  let lo = Math.min(...values, 0);
  let hi = Math.max(...values, 0);
  const pad = Math.max((hi - lo) * padFrac, 0.5);
  lo -= pad;
  hi += pad;
  const span = hi - lo || 1;
  const step = (() => {
    const n = 10 ** Math.floor(Math.log10(span / 3));
    const t = span / 3 / n;
    return t <= 1 ? n : t <= 2 ? 2 * n : t <= 5 ? 5 * n : 10 * n;
  })();
  return {
    yMin: Math.floor(lo / step) * step,
    yMax: Math.ceil(hi / step) * step,
  };
}

function GapTooltip({
  active,
  payload,
  gapName,
  compareName,
  compareColor,
  compare,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: GrowthGapPoint }>;
  gapName: string;
  compareName: string;
  compareColor: string;
  compare: GapCompare;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  const note = gapChartNote(row.year, compare);

  return (
    <div className="max-w-sm rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="mb-2 font-semibold text-slate-900">{row.year}</p>
      <div className="space-y-1 text-sm">
        <p style={{ color: CHART_COLORS.china }}>
          <span className="font-medium">{gapName}:</span> {fmtPp(row.gap)}
        </p>
        <p style={{ color: CHART_COLORS.china }}>
          <span className="font-medium">China growth:</span> {fmtPct(row.chinaYoY)}
        </p>
        <p style={{ color: compareColor }}>
          <span className="font-medium">{compareName} growth:</span> {fmtPct(row.compareYoY)}
        </p>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
        {note}
      </div>
    </div>
  );
}

export function GrowthGapLineChart({
  title,
  subtitle,
  data,
  gapName,
  gapColor,
  compareName,
  compareColor,
  compare,
  footer,
}: {
  title: string;
  subtitle: string;
  data: GrowthGapPoint[];
  gapName: string;
  gapColor: string;
  compareName: string;
  compareColor: string;
  compare: GapCompare;
  footer: string;
}) {
  const axis = lineChartAxisBounds(data.map((d) => d.gap));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={3} />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[axis.yMin, axis.yMax]}
              tickFormatter={(v) => `${Number(v) > 0 ? "+" : ""}${v}pp`}
            />
            <Tooltip
              content={(props) => (
                <GapTooltip
                  active={props.active}
                  payload={props.payload as ReadonlyArray<{ payload: GrowthGapPoint }> | undefined}
                  gapName={gapName}
                  compareName={compareName}
                  compareColor={compareColor}
                  compare={compare}
                />
              )}
            />
            <ReferenceLine
              y={0}
              stroke="#f59e0b"
              strokeWidth={2.5}
              label={{ value: "0%", fill: "#f59e0b", fontSize: 11, position: "insideTopLeft" }}
            />
            <Line
              type="monotone"
              dataKey="gap"
              stroke={gapColor}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: gapColor }}
              activeDot={{ r: 6 }}
              name={gapName}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-3 text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  );
}

export function buildUsChinaGapData(
  rows: { year: number; chinaYoY: number | null; usYoY: number | null }[],
): GrowthGapPoint[] {
  return rows
    .filter((d) => d.chinaYoY !== null && d.usYoY !== null)
    .map((d) => ({
      year: d.year,
      gap: (d.usYoY ?? 0) - (d.chinaYoY ?? 0),
      chinaYoY: d.chinaYoY ?? 0,
      compareYoY: d.usYoY ?? 0,
    }));
}

export function buildIndiaChinaGapData(
  rows: { year: number; chinaYoY: number | null; indiaYoY: number | null }[],
): GrowthGapPoint[] {
  return rows
    .filter((d) => d.chinaYoY !== null && d.indiaYoY !== null)
    .map((d) => ({
      year: d.year,
      gap: (d.indiaYoY ?? 0) - (d.chinaYoY ?? 0),
      chinaYoY: d.chinaYoY ?? 0,
      compareYoY: d.indiaYoY ?? 0,
    }));
}
