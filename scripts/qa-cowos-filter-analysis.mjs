import fs from "node:fs";

const dataPath = "src/data/ai-packaging-bottleneck-data.ts";
const dashboardPath = "src/components/visualizations/AiPackagingBottleneckDashboard.tsx";
const dataSrc = fs.readFileSync(dataPath, "utf8");

// Parse SUPPLY_CHAIN records (simplified: only cowos-related ids in file order)
const records = [];
const blocks = dataSrc.split(/\n  \{\n/).slice(1);
for (const block of blocks) {
  const id = block.match(/id: \"([^\"]+)\"/)?.[1];
  const metric = block.match(/metric: \"([^\"]+)\"/)?.[1];
  const year = Number(block.match(/year: (\d+)/)?.[1]);
  const value = Number(block.match(/value: ([\d_]+)/)?.[1]?.replace(/_/g, ""));
  const entity = block.match(/entity: \"([^\"]+)\"/)?.[1];
  if (!id || !metric || !year) continue;
  if (!id.includes("cowos")) continue;
  records.push({ id, entity, metric, year, value });
}

const oldFilter = records.filter((r) => r.metric.includes("CoWoS wafer demand"));
const newFilter = records.filter((r) => r.id.startsWith("cowos-demand-"));
const excludedByFix = oldFilter.filter((r) => !r.id.startsWith("cowos-demand-"));

const dashboardSrc = fs.readFileSync(dashboardPath, "utf8");
const currentFilter = dashboardSrc.match(/SUPPLY_CHAIN\.filter\(\(r\) => ([^)]+)\)/)?.[1];

console.log(
  JSON.stringify(
    {
      currentFilter,
      oldFilterRecords: oldFilter.map((r) => ({
        id: r.id,
        entity: r.entity,
        year: r.year,
        valueK: r.value / 1000,
        metric: r.metric,
      })),
      newFilterRecords: newFilter.map((r) => ({
        id: r.id,
        entity: r.entity,
        year: r.year,
        valueK: r.value / 1000,
        metric: r.metric,
      })),
      excludedByFix: excludedByFix.map((r) => ({
        id: r.id,
        entity: r.entity,
        year: r.year,
        valueK: r.value / 1000,
        metric: r.metric,
      })),
      points2026OldFilter: oldFilter
        .filter((r) => r.year === 2026)
        .map((r) => ({ id: r.id, entity: r.entity, valueK: r.value / 1000 })),
    },
    null,
    2,
  ),
);
