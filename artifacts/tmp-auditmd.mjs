import fs from "node:fs";

const md = fs.readFileSync("artifacts/qa-site-audit-2026-08-23.md", "utf8");
console.log(md.slice(0, 3500));
