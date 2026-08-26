import fs from "node:fs";

const text = fs.readFileSync("src/data/posts.ts", "utf8");
const lines = text.split(/\r?\n/);

// Map line index -> owning post slug (last seen id/slug before that line)
const deadSlugs = new Set([
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
  "us-immigration-court-backlog-2025",
  "us-net-interest-vs-defense-2025",
  "us-personal-saving-rate-post-excess-2026",
  "us-social-security-trust-fund-depletion-2034",
]);

let current = "(unknown)";
const linkRe = /\[([^\]]*)\]\(\/blog\/([a-z0-9-]+)\)/g;
console.log("=== Occurrences: sourceSlug | deadTarget | anchor ===");
for (let i = 0; i < lines.length; i++) {
  const idm = lines[i].match(/^\s*(?:id|slug):\s*"([a-z0-9-]+)"/);
  if (idm) current = idm[1];
  linkRe.lastIndex = 0;
  let m;
  while ((m = linkRe.exec(lines[i])) !== null) {
    if (deadSlugs.has(m[2])) {
      console.log(`${current} | ${m[2]} | ${m[1]}`);
    }
  }
}

console.log("\n=== Live posts whose title mentions key topics ===");
const kws = [
  "helium", "lng", "liquefied", "nuclear", "rare earth", "graphite",
  "immigration", "saving", "defense", "military", "credit card", "card apr",
  "delinquen", "robot", "phosphate", "copper", "data center", "grid",
  "social security", "trust fund", "cre ", "commercial real estate",
];
const entryRe =
  /\{\s*\r?\n\s*id:\s*"([^"]+)"[\s\S]*?title:\s*\r?\n?\s*"([\s\S]*?)"[\s\S]*?(?=\n  \{|\n\];)/g;
let em;
while ((em = entryRe.exec(text)) !== null) {
  const t = em[2];
  for (const kw of kws) {
    if (t.toLowerCase().includes(kw)) {
      console.log(`[${kw}] ${em[1]} :: ${t.slice(0, 110)}`);
      break;
    }
  }
}
