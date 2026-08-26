import fs from "node:fs";

const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
// Find every post declaring one of the 3 ids
const ids = [
  "industrial-robotics-research-2026",
  "ai-supply-chain-research-2026",
  "us-billion-dollar-weather-disasters-ms94skof",
];
for (const id of ids) {
  const re = new RegExp(`visualization:\\s*"${id}"`, "g");
  const matches = [...t.matchAll(re)];
  console.log(`\n"${id}": ${matches.length} post(s)`);
  for (const m of matches) {
    // walk back to nearest slug above
    const before = t.slice(Math.max(0, m.index - 3000), m.index);
    const slugs = [...before.matchAll(/slug: "([a-z0-9-]+)"/g)];
    console.log("   post slug:", slugs[slugs.length - 1]?.[1]);
  }
}

// And what does the smoke script actually test?
const sm = fs.readFileSync("scripts/smoke-test-viz-posts.mjs", "utf8");
for (const id of ids) console.log(`smoke script mentions "${id}":`, sm.includes(id));
