import fs from "node:fs";

const posts = fs.readFileSync("src/data/posts.ts", "utf8");
const removeSlugs = [
  "global-helium-supply-concentration-2024",
  "lng-export-capacity-us-australia-qatar-2024",
  "manufacturing-robot-density-ifr-2024",
  "nato-defense-spending-gdp-2-percent-2024",
  "us-immigration-court-backlog-2025",
];

for (const s of removeSlugs) {
  const re = new RegExp(`\\[([^\\]]+)\\]\\(/blog/${s}\\)`, "g");
  let m;
  console.log(`\n########## ${s}`);
  while ((m = re.exec(posts)) !== null) {
    const start = Math.max(0, m.index - 150);
    const end = Math.min(posts.length, m.index + m[0].length + 120);
    const ctx = posts.slice(start, end).replace(/\s+/g, " ");
    console.log(`--- anchor="${m[1]}"`);
    console.log(`…${ctx}…`);
  }
}
