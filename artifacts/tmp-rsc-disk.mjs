import fs from "node:fs";
import path from "node:path";

// 1) Does out/ contain flat .txt AND/OR nested __next payloads for blog posts?
const cat = "out/category";
const cf = path.join(cat, "consumer-finance");
const all = [];
const walk = (dir, depth = 0) => {
  if (depth > 6) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, depth + 1);
    else all.push(path.relative("out", p).replaceAll("\\", "/"));
  }
};
walk(cf);
console.log("== out/category/consumer-finance files ==");
for (const f of all.sort()) console.log(" ", f);

// 2) What does the built client request? Search static chunks for the marker
const chunksDir = "out/_next/static/chunks";
let found = new Set();
const scan = (dir, depth = 0) => {
  if (depth > 4) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) scan(p, depth + 1);
    else if (e.name.endsWith(".js")) {
      const t = fs.readFileSync(p, "utf8");
      if (t.includes("__next.") || t.includes(".txt")) {
        const m = t.match(/["'`]([^"'`]*__next[^"'`]{0,60})["'`]/g) || [];
        for (const x of m) found.add(x.slice(0, 80));
      }
    }
  }
};
scan(chunksDir);
console.log("\n== __next string literals in client chunks ==");
for (const f of [...found].slice(0, 25)) console.log(" ", f);

// 3) Check a built blog page HTML for prefetch hints
const html = fs
  .readdirSync("out/blog/adaptation-economics-concentration-2026")
  .filter((f) => f.endsWith(".html") || f.endsWith(".txt"));
console.log("\n== out/blog/adaptation-economics-concentration-2026 contents ==");
for (const f of html) console.log(" ", f);
