import fs from "node:fs";
import path from "node:path";

const smoke = fs.readFileSync("scripts/smoke-test-viz-posts.mjs", "utf8");
const entries = [...smoke.matchAll(/slug:\s*"([a-z0-9-]+)"[\s\S]{0,200}?marker:\s*"((?:[^"\\]|\\.)*)"/g)].map(
  (m) => ({ slug: m[1], marker: m[2] }),
);
const missing = entries.filter((e) => !fs.existsSync(path.join("out/blog", e.slug)));
console.log("missing built page dirs:", missing.length);
for (const m of missing) console.log(" -", m.slug);

// posts.ts declared slugs vs out dirs
const posts = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const declared = new Set([...posts.matchAll(/slug:\s*"([^"]+)"/g)].map((x) => x[1]));
const built = new Set(fs.readdirSync("out/blog"));
const notBuilt = [...declared].filter((s) => !built.has(s));
console.log("\ndeclared:", declared.size, "| built:", built.size, "| declared-not-built:", notBuilt.length);
for (const s of notBuilt.slice(0, 15)) console.log(" !", s);
