import fs from "node:fs";

// The 4 missing slugs are the FIRST FOUR entries of the array. Check whether
// the array literal actually opens correctly — maybe a syntax anomaly (stray
// bracket/comment) makes the parser treat them as part of a different array.
const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
console.log("=== first 30 lines ===");
for (const l of t.split("\n").slice(0, 30)) console.log(l.slice(0, 120));

// Also count how many entries appear BEFORE the first missing slug's entry end.
// And check: is there more than one `samplePosts` export or an override?
const exports_ = [...t.matchAll(/export const (\w+)/g)].map((m) => m[1]);
console.log("\nexports:", exports_.join(", "));
