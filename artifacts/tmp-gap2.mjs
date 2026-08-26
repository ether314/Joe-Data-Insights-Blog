import fs from "node:fs";
import path from "node:path";

const t = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
const slugs = [...t.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);

const outBlog = "out/blog";
const built = fs
  .readdirSync(outBlog, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const builtSet = new Set(built);
const missing = slugs.filter((s) => !builtSet.has(s));

console.log("posts.ts slugs:", slugs.length, "| out/blog dirs:", built.length, "| missing:", missing.length);
for (const m of missing) console.log("  -", m);

// For each missing slug: does it exist in posts.ts NOW? Did the build see it?
// Check build-time manifest if Next emits one (prerender-manifest / app-path-routes)
for (const f of ["out/_next/prerender-manifest.json"]) {
  if (fs.existsSync(f)) {
    const pm = JSON.parse(fs.readFileSync(f, "utf8"));
    const routes = Object.keys(pm.routes || {});
    const blogRoutes = routes.filter((r) => r.startsWith("/blog/"));
    console.log("\nprerender-manifest blog routes:", blogRoutes.length);
    for (const m of missing) {
      console.log(`  manifest has /blog/${m}:`, pm.routes[`/blog/${m}`] ? "YES" : "NO");
    }
  } else {
    console.log("(no prerender-manifest at", f + ")");
  }
}
