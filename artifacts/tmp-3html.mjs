import fs from "node:fs";

// Do the built HTML pages contain a data-viz root for these 3 posts?
// (If my dispatcher edits were dropped AND posts still render viz, something
// else dispatches them — or the built HTML predates the drop.)
const slugs = [
  "industrial-robotics-research-2026",
  "ai-supply-chain-research-2026",
  "us-billion-dollar-weather-disasters-ms94skof",
];
for (const s of slugs) {
  const html = fs.readFileSync(`out/blog/${s}.html`, "utf8");
  const markers = [...html.matchAll(/data-viz="([^"]+)"/g)].map((m) => m[1]);
  console.log(`${s}: ${markers.length ? markers.join(", ") : "NO data-viz marker"}`);
}
