import fs from "node:fs";

// Are the 4 missing slugs present in the posts.ts array at all, or inside a
// different structure (e.g. a second export / draft list)? Show 2 lines of
// context around each declaration.
const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const targets = [
  "women-and-men-in-apprentice-trades-2026",
  "office-vacancy-versus-conversion-pipelines-2026",
  "hospital-system-clout-vs-commercial-prices-2026",
  "institutional-share-of-single-family-rentals-2026",
];
for (const s of targets) {
  let i = t.indexOf(`slug: "${s}"`);
  console.log(`\n=== ${s} @ char ${i} ===`);
  if (i === -1) continue;
  // show preceding 400 chars to see nesting context
  const before = t.slice(Math.max(0, i - 500), i);
  const lines = before.split("\n").slice(-12);
  for (const l of lines) console.log("  |", l.slice(0, 100));
}
