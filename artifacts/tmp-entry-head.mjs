import fs from "node:fs";

const posts = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
// Extract the full entry for the GLP-1 post and look at every field
const starts = [...posts.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => ({
  slug: m[1],
  idx: m.index,
}));
starts.push({ slug: "__END__", idx: posts.length });

for (const slug of ["employer-coverage-of-glp-1-weight-loss-drugs-2026", "farm-share-of-the-food-dollar-2026"]) {
  const si = starts.findIndex((s) => s.slug === slug);
  const block = posts.slice(starts[si].idx, starts[si + 1].idx);
  // Print everything except the content body (too long)
  const head = block.split("content:`")[0] || block.slice(0, 1200);
  console.log(`\n===== ${slug} =====`);
  console.log(head);
}
