/**
 * QA: chokepoint-commodities-geography-2026
 * // viz-types: country share bars, regional pie, mine→mid flip dumbbell, mine×mid scatter, regional Top-1 seats | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MINE_GEOGRAPHIES,
  MIDSTREAM_GEOGRAPHIES,
  STAGE_FLIPS,
} from "../src/data/chokepoint-commodities-geography-2026-data.ts";

assert.equal(HEADLINE.commoditiesMapped, 14);
assert.equal(HEADLINE.chinaTotalTop1Count, 9);
assert.equal(HEADLINE.chinaMidstreamTop1Count, 6);
assert.equal(HEADLINE.largestMineToMidFlipPp, 66);
assert.equal(MINE_GEOGRAPHIES.length, 8);
assert.equal(MIDSTREAM_GEOGRAPHIES.length, 6);
assert.equal(STAGE_FLIPS[0].id, "cobalt");
assert.equal(STAGE_FLIPS[0].flipPp, 66);

const root = process.cwd();
const slug = "chokepoint-commodities-geography-2026";
const markers = [
  "Chokepoint commodities — geography lens",
  "Country shares —",
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
  const port = Number(process.env.SMOKE_PORT || 4186);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      console.error("✗ Failed to load post HTML");
      process.exit(1);
    }
    await page.waitForSelector(
      '[data-viz="chokepoint-commodities-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regional pie");
    await clickBtn(page, "Country bars");
    await clickBtn(page, "Midstream");
    await clickBtn(page, "Mine");
    await clickBtn(page, "Mine → mid flips");
    await clickBtn(page, "Mine × mid scatter");
    await clickBtn(page, "Regional hubs");
    await clickBtn(page, "Country hub stack");
    await clickBtn(page, "Regional Top-1 seats");
    await clickBtn(page, "Country / region shares");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-chokepoint-commodities-geography-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
