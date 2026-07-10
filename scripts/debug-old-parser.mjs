import { readFileSync } from "fs";

const src = readFileSync("src/data/ai-data-centers-data.ts", "utf8");
const sites = [...src.matchAll(/site: "([^"]+)"[\s\S]*?costUsd: "([^"]+)"/g)].map((m) => ({
  site: m[1],
  costUsd: m[2],
}));

function oldEstimate(costText) {
  const text = costText.toLowerCase();
  if (text.includes("tbd") || text.includes("undisclosed") || text.includes("part of"))
    return null;
  const nums = [...text.matchAll(/(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
  if (!nums.length) return null;
  const toBillions = (n) => {
    if (text.includes("trillion") || text.includes("t")) return n * 1000;
    if (text.includes("m")) return n / 1000;
    return n;
  };
  if (text.includes("–") || text.includes("-") || text.includes(" to ")) {
    const lo = toBillions(Math.min(...nums));
    const hi = toBillions(Math.max(...nums));
    return { low: lo, base: (lo + hi) / 2, high: hi };
  }
  if (text.includes("+")) {
    const v = toBillions(nums[0]);
    return { low: v, base: v * 1.15, high: v * 1.3 };
  }
  if (nums.length === 1) {
    const v = toBillions(nums[0]);
    return { low: v, base: v, high: v };
  }
  const lo = toBillions(Math.min(...nums));
  const hi = toBillions(Math.max(...nums));
  return { low: lo, base: (lo + hi) / 2, high: hi };
}

const rollup = { low: 0, base: 0, high: 0, known: 0, unknown: 0 };
const inflated = [];

for (const { site, costUsd } of sites) {
  const e = oldEstimate(costUsd);
  if (!e) {
    rollup.unknown++;
    continue;
  }
  rollup.low += e.low;
  rollup.base += e.base;
  rollup.high += e.high;
  rollup.known++;
  if (e.base > 500) inflated.push({ site, costUsd, ...e });
}

console.log("OLD parser rollup:", rollup);
console.log("Formatted base:", `$${(rollup.base / 1000).toFixed(2)}T`);
console.log("\nInflated rows (>500B base):");
inflated
  .sort((a, b) => b.base - a.base)
  .forEach((r) => console.log(`  ${r.base.toFixed(0)}B  ${r.site}  |  ${r.costUsd}`));
