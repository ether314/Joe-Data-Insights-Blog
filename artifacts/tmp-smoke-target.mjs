import fs from "node:fs";
import path from "node:path";

const smoke = fs.readFileSync("scripts/smoke-test-viz-posts.mjs", "utf8");
const entries = [...smoke.matchAll(/slug:\s*"([a-z0-9-]+)"[\s\S]{0,200}?marker:\s*"((?:[^"\\]|\\.)*)"/g)].map(
  (m) => ({ slug: m[1], marker: m[2] }),
);
console.log("smoke entries:", entries.length);
const missing = entries.filter(
  (e) => !fs.existsSync(path.join("out/blog", e.slug, "index.html")),
);
console.log("missing built pages:", missing.length ? missing.map((m) => m.slug) : "NONE");

// find the hospital-clout entry
const target = entries.find((e) => e.marker.includes("Hospital clout"));
console.log("\ntarget entry:", JSON.stringify(target));
if (target) {
  console.log("built page exists:", fs.existsSync(path.join("out/blog", target.slug)));
}
