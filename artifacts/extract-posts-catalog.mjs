import fs from "fs";

const text = fs.readFileSync("src/data/posts.ts", "utf8");
const posts = [];

const slugRe = /slug:\s*"([^"]+)"/g;
let match;
const slugIndexes = [];
while ((match = slugRe.exec(text)) !== null) {
  slugIndexes.push({ slug: match[1], index: match.index });
}

function extractQuotedField(chunk, field) {
  // Prefer first occurrence of field: "..."
  const dq = new RegExp(`${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`);
  const dqMatch = chunk.match(dq);
  if (dqMatch) return dqMatch[1].replace(/\\n/g, " ").replace(/\\"/g, '"');

  // Multi-line string concat style: field:\n  "..."
  const ml = new RegExp(`${field}:\\s*\\n\\s*"((?:\\\\.|[^"\\\\])*)"`);
  const mlMatch = chunk.match(ml);
  if (mlMatch) return mlMatch[1].replace(/\\n/g, " ").replace(/\\"/g, '"');

  return null;
}

for (let i = 0; i < slugIndexes.length; i++) {
  const start = slugIndexes[i].index;
  const end = i + 1 < slugIndexes.length ? slugIndexes[i + 1].index : text.length;
  // Full post chunk — needed because category can sit after a huge content template
  const chunk = text.slice(start, end);
  const title = extractQuotedField(chunk, "title");
  const excerpt = extractQuotedField(chunk, "excerpt");
  const category = extractQuotedField(chunk, "category");
  const themeId = extractQuotedField(chunk, "themeId");
  posts.push({
    slug: slugIndexes[i].slug,
    title: title || "(missing title)",
    excerpt: (excerpt || "").slice(0, 180),
    category: category || "Unknown",
    themeId: themeId || null,
  });
}

const byCat = {};
for (const p of posts) byCat[p.category] = (byCat[p.category] || 0) + 1;

fs.writeFileSync(
  "artifacts/posts-catalog-for-reddit.json",
  JSON.stringify({ count: posts.length, byCategory: byCat, posts }, null, 2)
);
console.log("COUNT", posts.length);
console.log("UNKNOWN", posts.filter((p) => p.category === "Unknown").length);
console.log("CATEGORIES", JSON.stringify(byCat, null, 2));
