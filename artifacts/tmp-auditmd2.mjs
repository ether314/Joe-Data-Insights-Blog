import fs from "node:fs";

const md = fs.readFileSync("artifacts/qa-site-audit-2026-08-23.md", "utf8");
// show rest of broken links + no_viz_root section
const i = md.indexOf("## Broken internal links");
console.log(md.slice(i + 3000, i + 9500));
