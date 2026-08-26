import fs from "node:fs";

const posts = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const starts = [...posts.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => ({
  slug: m[1],
  idx: m.index,
}));
starts.push({ slug: "__END__", idx: posts.length });

for (const slug of [
  "women-and-men-in-apprentice-trades-2026",
  "hospital-system-clout-vs-commercial-prices-2026",
]) {
  const si = starts.findIndex((s) => s.slug === slug);
  if (si === -1) { console.log(slug, "not found"); continue; }
  const block = posts.slice(starts[si].idx, starts[si + 1].idx);
  const pub = block.match(/publishedAt:\s*\n?\s*"([^"]+)"/);
  const viz = block.match(/visualization:\s*\n?\s*"([^"]*)"/);
  console.log(`${slug}\n  publishedAt=${pub ? pub[1] : "?"} visualization=${viz ? viz[1] : "(none)"}`);
}
