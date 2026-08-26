import fs from "node:fs";

const file = "src/data/posts.ts";
let text = fs.readFileSync(file, "utf8");
const before = text;

const repoint = {
  "copper-mine-vs-refinery-concentration-2024": "copper-mine-vs-refinery-geography-2026",
  "cre-bank-delinquency-size-split-2026": "bank-commercial-credit-research-2026",
  "phosphate-rock-supply-concentration-2024": "phosphate-fertilizer-export-dependence-2026",
  "rare-earth-mine-concentration-2024": "natural-graphite-mine-concentration-2024",
  "sipri-world-military-expenditure-2024": null,
  "us-credit-card-apr-vs-fed-funds-2026": "consumer-finance-markets-research-2026",
  "us-data-center-power-vs-grid-capacity-2025": "ai-power-grid-research-2026",
  "us-household-debt-delinquency-split-2026": "consumer-finance-markets-research-2026",
  "us-net-interest-vs-defense-2025": null,
  "us-personal-saving-rate-post-excess-2026": null,
  "us-social-security-trust-fund-depletion-2034": "us-social-security-trust-fund-depletion-path-2026",
};

const removeOnly = [
  "global-helium-supply-concentration-2024",
  "lng-export-capacity-us-australia-qatar-2024",
  "manufacturing-robot-density-ifr-2024",
  "nato-defense-spending-gdp-2-percent-2024",
  "us-immigration-court-backlog-2025",
];

const report = { repointed: {}, removed: {} };

for (const [dead, live] of Object.entries(repoint)) {
  const re = new RegExp(`\\[([^\\]]+)\\]\\(/blog/${dead}\\)`, "g");
  let n = 0;
  if (live) {
    text = text.replace(re, (_all, anchor) => {
      n++;
      return `[${anchor}](/blog/${live})`;
    });
    report.repointed[`${dead} -> ${live}`] = n;
  } else {
    text = text.replace(re, (_all, anchor) => {
      n++;
      return anchor;
    });
    report.removed[dead] = n;
  }
}

for (const dead of removeOnly) {
  const re = new RegExp(`\\[([^\\]]+)\\]\\(/blog/${dead}\\)`, "g");
  let n = 0;
  text = text.replace(re, (_all, anchor) => {
    n++;
    return anchor;
  });
  report.removed[dead] = n;
}

fs.writeFileSync(file, text);
console.log(JSON.stringify(report, null, 2));
console.log("changed:", before !== text);

// Verify: no dead /blog/ markdown-link targets remain
const slugs = new Set(
  [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
);
const linkRe = /\[[^\]]*\]\(\/blog\/([a-z0-9-]+)\)/g;
const remaining = [];
let m;
while ((m = linkRe.exec(text)) !== null) {
  if (!slugs.has(m[1])) remaining.push(m[1]);
}
console.log("remaining dead targets:", remaining.length ? remaining : "NONE");
