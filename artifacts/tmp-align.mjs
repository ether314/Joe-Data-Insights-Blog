import fs from "node:fs";

// Count entries in the array by top-level "  {" at column 2
const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const entryStarts = [...t.matchAll(/^  \{$/gm)].map((m) => m.index);
const slugCount = [...t.matchAll(/^    slug: /gm)].length;
console.log("entry braces:", entryStarts.length, "| slug fields:", slugCount);

// id vs slug mismatches (id of one = slug of another?)
const ids = [...t.matchAll(/^    id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
const slugs = [...t.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
console.log("ids:", ids.length, "slugs:", slugs.length);
if (ids.length === slugs.length) {
  const mismatched = ids.filter((id, i) => id !== slugs[i]);
  console.log("id!=slug count:", mismatched.length);
  for (const [i, id] of ids.entries()) {
    if (id !== slugs[i]) console.log(`  entry ${i}: id=${id} slug=${slugs[i]}`);
  }
} else {
  console.log("ALIGNMENT BROKEN — pairing id/slug by position:");
  for (let i = 0; i < Math.min(ids.length, slugs.length); i++) {
    if (ids[i] !== slugs[i]) console.log(`  entry ${i}: id=${ids[i]} slug=${slugs[i]}`);
  }
}
