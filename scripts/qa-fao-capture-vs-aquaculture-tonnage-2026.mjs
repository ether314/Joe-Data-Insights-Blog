/**
 * QA: fao-capture-vs-aquaculture-tonnage-2026
 * // viz-types: stacked capture|aqua bars, world share area+line, region share multi-line, habitat stacked, producer scatter, growth pie, 2022→2032 delta bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_ROWS,
  TOP_PRODUCERS,
  WORLD_AQUA_SHARE_PATH,
} from "../src/data/fao-capture-vs-aquaculture-tonnage-2026-data.ts";

assert.equal(HEADLINE.worldAquaSharePct, 51);
assert.equal(HEADLINE.worldCaptureSharePct, 49);
assert.equal(HEADLINE.worldAquaMt, 94.4);
assert.equal(HEADLINE.worldCaptureMt, 91.0);
assert.equal(HEADLINE.worldTotalMt, 185.4);
assert.equal(HEADLINE.edibleAquaSharePct, 57);
assert.equal(HEADLINE.asiaAquaSharePct, 64);
assert.equal(HEADLINE.northernAmericaAquaSharePct, 11);
assert.equal(HEADLINE.aquaMajorityRegionCount, 1);
assert.equal(HEADLINE.captureMajorityRegionCount, 5);
assert.equal(HEADLINE.crossoverYear, 2022);
assert.ok(REGION_ROWS.length >= 6);
assert.equal(REGION_ROWS.find((r) => r.id === "asia")?.aquaSharePct, 64);
assert.equal(
  REGION_ROWS.find((r) => r.id === "northern-america")?.aquaSharePct,
  11,
);
assert.ok(TOP_PRODUCERS.length >= 6);
assert.ok(WORLD_AQUA_SHARE_PATH.length >= 6);
assert.equal(
  WORLD_AQUA_SHARE_PATH.find((p) => p.year === 2022)?.aquaSharePct,
  51,
);

const root = process.cwd();
const slug = "fao-capture-vs-aquaculture-tonnage-2026";
const markers = [
  "FAO capture vs aquaculture tonnage",
  "Where wild capture still dominates edible aquatic-animal supply",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4182);
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
      '[data-viz="fao-capture-vs-aquaculture-tonnage-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regions");
    await clickBtn(page, "Million tonnes");
    await clickBtn(page, "Aqua share %");
    await clickBtn(page, "Asia");
    await clickBtn(page, "All");
    await clickBtn(page, "Share paths");
    await clickBtn(page, "World path");
    await clickBtn(page, "By continent");
    await clickBtn(page, "Habitat");
    await clickBtn(page, "Producers");
    await clickBtn(page, "Regions");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
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
