import fs from "node:fs";

const d = JSON.parse(fs.readFileSync("artifacts/qa-site-audit-2026-08-23.json", "utf8"));
const samples = new Map();
for (const p of d.pages || []) {
  for (const sub of p.failedSubresources || []) {
    const url = typeof sub === "string" ? sub : sub.url || JSON.stringify(sub);
    const m = url.match(/__next[^?]*/);
    const key = m ? m[0] : url;
    if (!samples.has(key)) samples.set(key, { url, page: p.url });
  }
}
console.log("distinct failed subresource path shapes:", samples.size);
let i = 0;
for (const [k, v] of samples) {
  console.log(`[${k}]`);
  console.log("   full:", v.url);
  if (++i >= 25) break;
}
