import fs from "node:fs";
import path from "node:path";

// Full inventory of one category dir after fresh build
const cf = "out/category/consumer-finance";
const all = [];
const walk = (dir, rel = "") => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(path.join(dir, e.name), r);
    else all.push(r);
  }
};
walk(cf);
console.log("== out/category/consumer-finance (fresh build) ==");
for (const f of all.sort()) console.log(" ", f);

// Which categories were prerendered?
console.log("\n== out/category top-level ==");
console.log(fs.readdirSync("out/category").join(", "));

// Do any dotted payload filenames exist anywhere?
let dotted = [];
const scan = (dir, depth = 0) => {
  if (depth > 5) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.includes("__next") && !e.name.endsWith(".txt")) dotted.push("[DIR] " + p.replace(/\\/g, "/"));
      scan(p, depth + 1);
    } else if (e.name.startsWith("__next")) dotted.push(p.replace(/\\/g, "/"));
  }
};
scan("out/category");
console.log("\n== sample of __next artifacts under out/category ==");
for (const d of dotted.slice(0, 20)) console.log(" ", d);

// blog post dir
const bp = fs.readdirSync("out/blog/us-share-of-global-source-plasma-2026");
console.log("\n== out/blog/us-share-of-global-source-plasma-2026 ==");
for (const f of bp) console.log(" ", f);
