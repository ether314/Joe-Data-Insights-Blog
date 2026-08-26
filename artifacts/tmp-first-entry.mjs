import fs from "node:fs";

const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const lines = t.split("\n");
// print the full first entry (women-and-men) up to the next entry boundary
const start = lines.findIndex((l) => l.includes('slug: "women-and-men-in-apprentice-trades-2026"'));
// find the content field end — look for the closing backtick-comma pattern
let depth = 0;
let printed = 0;
for (let i = Math.max(0, start - 3); i < Math.min(lines.length, start + 60); i++) {
  console.log(String(i + 1).padStart(6), "|", lines[i].slice(0, 160));
  printed++;
}
