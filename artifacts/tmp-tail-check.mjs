import fs from "node:fs";

const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const lines = t.split("\n");
// Show the tail of the array and any syntax oddity around the 4 missing slugs
const missing = [
  "women-and-men-in-apprentice-trades-2026",
  "office-vacancy-versus-conversion-pipelines-2026",
  "hospital-system-clout-vs-commercial-prices-2026",
  "institutional-share-of-single-family-rentals-2026",
];
for (const slug of missing) {
  const i = lines.findIndex((l) => l.includes(`slug: "${slug}"`));
  console.log(`${slug} at line ${i + 1}`);
}
console.log("\n== last 6 lines of file ==");
console.log(lines.slice(-6).join("\n"));

// Check the entry right BEFORE the first missing one for a trailing comma issue
const first = lines.findIndex((l) => l.includes('slug: "women-and-men-in-apprentice-trades-2026"'));
console.log("\n== context before women-and-men entry ==");
console.log(lines.slice(Math.max(0, first - 8), first + 2).join("\n"));
