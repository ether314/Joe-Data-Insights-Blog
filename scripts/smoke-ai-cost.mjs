import { readFileSync } from "fs";

// Inline minimal copy to test - import ts not available without tsx
const src = readFileSync("src/data/ai-data-centers-data.ts", "utf8");
eval(
  src
    .replace(/^import .*$/gm, "")
    .replace(/export type [\s\S]*?;/g, "")
    .replace(/export /g, "")
    .replace(/: Site\[\]/g, "")
    .replace(/: Record<[^>]+>/g, "")
    .replace(/: \(typeof REGION_ORDER\)\[\]/g, "")
    .replace(/as const/g, "")
    .replace(/: SortKey/g, "")
    .replace(/: SortDir/g, "")
    .replace(/: ProjectStatus/g, "")
    .replace(/: BuildPhase/g, "")
    .replace(/: string/g, "")
    .replace(/: number/g, "")
    .replace(/: boolean/g, "")
    .replace(/: CostDisplay/g, "")
    .replace(/: FxCurrency/g, "")
    .replace(/: Region/g, "")
);

for (const s of SITES) {
  try {
    formatCostDisplay(s.costUsd);
  } catch (e) {
    console.error("FAIL", s.site, e.message);
    process.exit(1);
  }
}
console.log("formatCostDisplay ok for", SITES.length, "sites");
