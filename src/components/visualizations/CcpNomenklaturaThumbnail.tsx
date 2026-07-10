"use client";

const layers = [
  { count: 2300 },
  { count: 355 },
  { count: 24 },
  { count: 7 },
];

export function CcpNomenklaturaThumbnail() {
  return (
    <div className="relative h-full w-full bg-[#0f1629] p-4">
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="flex flex-col items-center gap-2">
          {layers.map((l, i) => (
            <div
              key={i}
              className="rounded border border-cyan-500/40 bg-cyan-950/40 text-center text-[10px] font-semibold text-cyan-200"
              style={{ width: 40 + i * 28, padding: "4px 8px" }}
            >
              {l.count >= 1000 ? `${(l.count / 1000).toFixed(1)}K` : l.count}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end">
        <p className="text-xs font-medium uppercase tracking-wider text-red-400">Politics · Interactive</p>
        <p className="mt-1 text-lg font-bold text-white">CCP Nomenklatura</p>
        <p className="mt-1 text-sm text-slate-300">Hierarchy · headcount · budget</p>
      </div>
    </div>
  );
}
