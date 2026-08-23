/**
 * QA: instant-domestic-rails-vs-swift-for-retail-2026
 * // viz-types: stacked area+line rail mix, corridor bars, regional stacked+line, speed-cost scatter, arrangement pie+bars, domestic composed | layout: default
 * // smoke-marker: Headline — rail share of retail FX
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CORRIDORS,
  HEADLINE,
  RAIL_MIX_SERIES,
  REGION_MIX,
} from "../src/data/instant-domestic-rails-vs-swift-for-retail-2026-data.ts";

assert.equal(HEADLINE.correspondentValueSharePct, 74);
assert.equal(HEADLINE.instantRailValueSharePct, 9);
assert.equal(HEADLINE.fpsCrossBorderCapablePct, 47);
assert.ok(RAIL_MIX_SERIES.length >= 7);
assert.ok(CORRIDORS.length >= 8);
assert.ok(REGION_MIX.length >= 4);

const root = process.cwd();
const slug = "instant-domestic-rails-vs-swift-for-retail-2026";
const markers = [
  "Headline — rail share of retail FX",
  "Rail mix timeline",
  "Corridor share",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="instant-domestic-rails-vs-swift-for-retail-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Corridor share");
    await clickBtn(page, "Value share");
    await clickBtn(page, "Cost");
    await clickBtn(page, "Asia-Pacific");
    await clickBtn(page, "Regional stack");
    await clickBtn(page, "Speed vs cost");
    await clickBtn(page, "System arrangements");
    await clickBtn(page, "RTGS arrangements");
    await clickBtn(page, "Domestic FPS lens");
    await clickBtn(page, "Rail mix timeline");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ auditVizInteractions");
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
