import fs from "node:fs";

const posts = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const slugs = [
  "employer-coverage-of-glp-1-weight-loss-drugs-2026",
  "farm-share-of-the-food-dollar-2026",
  "us-cattle-herd-at-seventy-year-lows-2026",
  "us-generic-sterile-injectable-shortages-2026",
];

const starts = [...posts.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => ({
  slug: m[1],
  idx: m.index,
}));
starts.push({ slug: "__END__", idx: posts.length });

for (const slug of slugs) {
  const si = starts.findIndex((s) => s.slug === slug);
  if (si === -1) {
    console.log(`${slug}: NOT IN posts.ts`);
    continue;
  }
  const block = posts.slice(starts[si].idx, starts[si + 1].idx);
  const vizm = block.match(/visualization:\s*\n?\s*"([^"]*)"/);
  const laym = block.match(/layout:\s*\n?\s*"([^"]*)"/);
  const pubm = block.match(/publishedAt:\s*\n?\s*"([^"]*)"/);
  const contentLen = (block.match(/content:/) || []).length;
  console.log(
    `${slug}\n  visualization=${vizm ? vizm[1] : "(none)"} layout=${laym ? laym[1] : "default"} publishedAt=${pubm ? pubm[1] : "?"} hasContent=${contentLen > 0} blockChars=${block.length}`,
  );
}

// Also check generateStaticParams source — maybe lib/posts filters something
const libPosts = fs.readFileSync("src/lib/posts.ts", "utf8");
console.log("\n== src/lib/posts.ts (first 60 lines) ==");
console.log(libPosts.split(/\r?\n/).slice(0, 60).join("\n"));
