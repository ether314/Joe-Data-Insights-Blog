/**
 * QA: global shipbuilding GT delivery concentration post.
 * // viz-types: share-treemap, build-vs-own scatter, segment stacked bars, milestone area, ownership lollipop | layout: default
 * Usage: node scripts/qa-global-shipbuilding-gt-delivery-concentration-2026.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const slug = "global-shipbuilding-gt-delivery-concentration-2026";
const markers = [
  "China delivers 54.6% of world GT",
  "Who delivered 2024 merchant-ship GT",
  "Build vs own — the ownership gap",
  "Segment leadership — China vs Korea vs Japan",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4186);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    if (!loaded) throw new Error(`Failed to load blog page for ${slug}`);
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    // Exercise panel toggles
    for (const label of ["By segment", "Build vs own", "Pipeline", "Deliveries"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
