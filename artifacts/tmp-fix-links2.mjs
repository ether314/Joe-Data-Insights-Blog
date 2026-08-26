import fs from "node:fs";

const file = "src/data/posts.ts";
let text = fs.readFileSync(file, "utf8");
const before = text;

const re = /\[([^\]]+)\]\(\/blog\/nuclear-under-construction-china-share-2026\)/g;
let n = 0;
text = text.replace(re, (_all, anchor) => {
  n++;
  return anchor;
});
fs.writeFileSync(file, text);
console.log("removed links:", n, "| changed:", before !== text);

// final verification: zero dead /blog/ markdown targets
const slugs = new Set([...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));
const linkRe = /\[[^\]]*\]\(\/blog\/([a-z0-9-]+)\)/g;
const remaining = [];
let m;
while ((m = linkRe.exec(text)) !== null) {
  if (!slugs.has(m[1])) remaining.push(m[1]);
}
console.log("remaining dead targets:", remaining.length ? [...new Set(remaining)] : "NONE");
console.log("total internal blog links:", text.match(linkRe).length);
