import fs from "node:fs";

// Compare a WORKING new-category post vs the 4 missing ones — field by field
const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const starts = [...t.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => ({
  slug: m[1],
  idx: m.index,
}));
starts.push({ slug: "__END__", idx: t.length });

const fields = (block) => {
  const out = {};
  for (const key of ["id", "slug", "category", "themeId", "publishedAt", "featured", "visualization", "layout"]) {
    const m = block.match(new RegExp(`\\b${key}:\\s*\\n?\\s*("?[^,\\n]+"?)`));
    out[key] = m ? m[1].slice(0, 60) : "(absent)";
  }
  out.contentChars = (block.split("content:`")[1] || "").length;
  return out;
};

// freight-rail merged at 05:32 and IS built. women-and-men merged 05:47 NOT built.
for (const slug of [
  "freight-rail-velocity-versus-shipper-rates-2026",
  "women-and-men-in-apprentice-trades-2026",
  "hospital-system-clout-vs-commercial-prices-2026",
]) {
  const si = starts.findIndex((s) => s.slug === slug);
  if (si === -1) { console.log(slug, "NOT FOUND"); continue; }
  const block = t.slice(starts[si].idx, starts[si + 1].idx);
  console.log(`\n== ${slug} ==`);
  console.log(JSON.stringify(fields(block), null, 2));
}
