import { execFileSync } from "node:child_process";
import fs from "node:fs";
const g = "C:/Program Files/Git/cmd/git.exe";
const head = execFileSync(g, ["show", "HEAD:src/data/posts.ts"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const wt = fs.readFileSync("src/data/posts.ts", "utf8");
const norm = (s) => s.replace(/\r\n/g, "\n");
console.log("HEAD == working tree (posts.ts):", norm(head) === norm(wt));
for (const [label, t] of [["HEAD", head], ["WT", wt]]) {
  console.log(
    label,
    "| dead us-data-center:", (t.match(/us-data-center-power-vs-grid-capacity-2025/g) || []).length,
    "| repoint->ai-power-grid-research:", (t.match(/\/blog\/ai-power-grid-research-2026\)/g) || []).length,
    "| helium:", (t.match(/global-helium-supply-concentration-2024/g) || []).length,
  );
}
// any dead /blog/ markdown targets in working tree?
const slugs = new Set([...norm(wt).matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));
const remaining = [];
let m;
const re = /\[[^\]]*\]\(\/blog\/([a-z0-9-]+)\)/g;
while ((m = re.exec(norm(wt))) !== null) if (!slugs.has(m[1])) remaining.push(m[1]);
console.log("dead internal targets in WT:", [...new Set(remaining)].length ? [...new Set(remaining)] : "NONE");
