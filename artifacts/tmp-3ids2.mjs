import fs from "node:fs";

const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const ids = [
  "industrial-robotics-research-2026",
  "ai-supply-chain-research-2026",
  "us-billion-dollar-weather-disasters-ms94skof",
];
// slug fields are ABOVE id; visualization comes after. Walk back further and
// collect the last 3 slug matches.
for (const id of ids) {
  const m = new RegExp(`visualization:\\s*"${id}"`).exec(t);
  const before = t.slice(Math.max(0, m.index - 20000), m.index);
  const slugs = [...before.matchAll(/slug: "([a-z0-9-]+)"/g)].map((x) => x[1]);
  console.log(`"${id}" -> post: ${slugs[slugs.length - 1]}`);
}
