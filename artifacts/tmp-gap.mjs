import fs from "node:fs";
import path from "node:path";

const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const slugs = [...t.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);

const outBlog = "out/blog";
const built = fs.existsSync(outBlog)
  ? fs.readdirSync(outBlog, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
  : [];

const builtSet = new Set(built);
const missing = slugs.filter((s) => !builtSet.has(s));
const stale = built.filter((b) => !slugs.includes(b));

console.log("posts.ts slugs:", slugs.length);
console.log("out/blog dirs:", built.length);
console.log("\nmissing from out/ (" + missing.length + "):");
for (const m of missing) console.log("  -", m);
console.log("\nin out/ but not posts.ts (" + stale.length + "):");
for (const s of stale) console.log("  +", s);
