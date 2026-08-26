import fs from "node:fs";

const text = fs.readFileSync("src/data/posts.ts", "utf8");
const slugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log("slugCount", slugs.length);

const dead = [
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
];

const set = new Set(slugs);
for (const d of dead) console.log(d, "isLive=" + set.has(d));

// find every markdown link in content fields pointing at /blog/<slug>
const linkRe = /\[([^\]]*)\]\(\/blog\/([a-z0-9-]+)\)/g;
const counts = new Map();
let m;
while ((m = linkRe.exec(text)) !== null) {
  const slug = m[2];
  if (!set.has(slug)) {
    counts.set(slug, (counts.get(slug) || 0) + 1);
  }
}
console.log("\nDead markdown-link targets (slug -> occurrences):");
for (const [slug, n] of [...counts.entries()].sort()) console.log(slug, n);

// candidate stems for mapping: print live slugs sharing key stems
const stems = [
  "copper", "refinery", "cre-", "bank-delinquency", "helium", "lng", "robot",
  "nato", "defense-spending", "military-expenditure", "nuclear-under-construction",
  "phosphate", "rare-earth", "credit-card", "apr", "data-center-power", "grid-capacity",
  "household-debt", "delinquency", "immigration-court", "net-interest", "saving-rate",
  "social-security", "trust-fund",
];
console.log("\nCandidate live slugs per stem:");
for (const s of stems) {
  const hits = slugs.filter((x) => x.includes(s));
  if (hits.length) console.log(`-- ${s}: ${hits.join(", ")}`);
}
