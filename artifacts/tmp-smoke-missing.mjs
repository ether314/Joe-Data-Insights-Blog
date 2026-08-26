import fs from "node:fs";
import path from "node:path";

// List every smoke POSTS slug and check it has a built page
const smoke = fs.readFileSync("scripts/smoke-test-viz-posts.mjs", "utf8");
const slugs = [...smoke.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
console.log("smoke post count:", slugs.length);
const missing = slugs.filter((s) => !fs.existsSync(path.join("out/blog", s)));
console.log("missing built pages:", missing.length ? missing : "NONE");

// Compare against posts.ts declared slugs
const posts = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const declared = new Set([...posts.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));
const built = new Set(fs.readdirSync("out/blog"));
const notBuilt = [...declared].filter((s) => !built.has(s));
console.log("\ndeclared in posts.ts:", declared.size);
console.log("declared but NOT built:", notBuilt.length ? notBuilt.slice(0, 20) : "NONE");
