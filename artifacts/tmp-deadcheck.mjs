import fs from "node:fs";

// Verify Fix 1 end-state directly in posts.ts: zero occurrences of the 17 dead slugs.
const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");

const deadSlugs = [
  "copper-mine-vs-refinery-concentration-2024",
  "cre-bank-delinquency-size-split-2026",
  "global-helium-supply-concentration-2024",
  "lng-export-capacity-us-australia-qatar-2024",
  "manufacturing-robot-density-ifr-2024",
  "nato-defense-spending-gdp-2-percent-2024",
  "nuclear-under-construction-china-share-2026",
  "phosphate-rock-supply-concentration-2024",
  "rare-earth-mine-concentration-2024",
  "sipri-world-military-expenditure-2024",
  "us-credit-card-apr-vs-fed-funds-2026",
  "us-data-center-power-vs-grid-capacity-2025",
  "us-household-debt-delinquency-split-2026",
  "us-net-interest-vs-defense-2025",
  "us-personal-saving-rate-post-excess-2026",
  "us-social-security-trust-fund-depletion-2034",
];

let total = 0;
for (const s of deadSlugs) {
  const n = t.split(`/blog/${s}`).length - 1;
  if (n > 0) {
    console.log(`STILL PRESENT: /blog/${s} x${n}`);
    total += n;
  }
}
console.log(total === 0 ? "\nCLEAN: 0 occurrences of all 16 dead slugs" : `\nTOTAL REMAINING: ${total}`);
