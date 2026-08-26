import fs from "node:fs";

const text = fs.readFileSync("src/data/posts.ts", "utf8");
const slugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

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

// also grab titles for context
const titleRe = /slug:\s*"([^"]+)"[\s\S]{0,400}?title:\s*\n?\s*"([^"]{0,120})/g;

const stop = new Set(["vs", "and", "the", "of", "in", "for", "post", "excess"]);
const tokens = (s) =>
  s.split("-").filter((t) => t.length > 2 && !stop.has(t) && !/^(19|20)\d\d/.test(t));

for (const d of dead) {
  const dt = new Set(tokens(d));
  const scored = slugs
    .map((s) => {
      const st = tokens(s);
      let overlap = 0;
      for (const t of st) if (dt.has(t)) overlap++;
      return { s, overlap };
    })
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || (a.s < b.s ? -1 : 1))
    .slice(0, 6);
  console.log(`\n${d}`);
  for (const { s, overlap } of scored) console.log(`   ${overlap}  ${s}`);
}
