import fs from "node:fs";
import path from "node:path";

// The 4 posts exist in posts.ts and dispatch fine, but no page was built.
// Check if their data modules / viz components have syntax issues by asking
// Next's manifest what it thinks the routes are.
const manifest = JSON.parse(
  fs.readFileSync(".next/app-path-routes-manifest.json", "utf8"),
);
const blogRoutes = Object.entries(manifest)
  .filter(([k]) => k.startsWith("/blog/"))
  .map(([k]) => k);
console.log("app-path-routes blog entries:", blogRoutes.length);

// Check prerender manifest for which slugs were actually generated
const pm = JSON.parse(fs.readFileSync(".next/prerender-manifest.json", "utf8"));
const routes = Object.keys(pm.routes || {}).filter((r) => r.startsWith("/blog/"));
console.log("prerendered blog routes:", routes.length);

const missing = [
  "/blog/employer-coverage-of-glp-1-weight-loss-drugs-2026",
  "/blog/farm-share-of-the-food-dollar-2026",
  "/blog/us-cattle-herd-at-seventy-year-lows-2026",
  "/blog/us-generic-sterile-injectable-shortages-2026",
];
for (const m of missing) {
  console.log(m, "in prerender manifest:", routes.includes(m));
}

// dynamic route fallbacks?
console.log("\ndynamicRoutes:", JSON.stringify(Object.keys(pm.dynamicRoutes || {})));
