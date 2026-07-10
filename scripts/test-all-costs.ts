import { SITES, formatCostDisplay } from "../src/data/ai-data-centers-data";

let failed = 0;
for (const s of SITES) {
  try {
    formatCostDisplay(s.costUsd);
  } catch (e) {
    console.log("FAIL", s.site, "|", s.costUsd, "|", e);
    failed++;
  }
}
if (failed) process.exit(1);
console.log(`All ${SITES.length} cost strings OK`);
