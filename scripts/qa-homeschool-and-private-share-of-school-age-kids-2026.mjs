/**
 * QA: homeschool-and-private-share-of-school-age-kids-2026
 * // smoke-marker: Non-public share of school-age
 * // viz-types: stacked non-public area+line, public-drop attribution pie,
 * // demography-vs-enrollment dual index, waterfall-style stacked bars,
 * // state non-public ladder, public-vs-school-age scatter
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DROP_ATTRIBUTION,
  HEADLINE,
  INDEX_PATH,
  NATIONAL_PATH,
  REGION_SUMMARY,
  STATE_PANEL,
  VIZ_MARKERS,
} from "../src/data/homeschool-and-private-share-of-school-age-kids-2026-data.ts";

assert.equal(HEADLINE.publicDropM, 1.3);
assert.equal(HEADLINE.publicDropPct, -2.5);
assert.equal(HEADLINE.demographyShareOfDropPct, 37);
assert.equal(HEADLINE.nonPublicSharePp, 2.7);
assert.equal(HEADLINE.nonPublicShare2019, 11.4);
assert.equal(HEADLINE.nonPublicShare2023, 14.1);
assert.ok(NATIONAL_PATH.length >= 7);
assert.ok(INDEX_PATH.length === NATIONAL_PATH.length);
assert.ok(STATE_PANEL.length >= 15);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(DROP_ATTRIBUTION.length === 4);
assert.equal(
  DROP_ATTRIBUTION.reduce((a, d) => a + d.pct, 0),
  100,
);

const root = process.cwd();
const slug = "homeschool-and-private-share-of-school-age-kids-2026";
const markers = [...VIZ_MARKERS];

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
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Drop decomposition");
    await page
      .getByText("Public drop decomposition", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Indexed paths");
    await page
      .getByText("Indexed paths (2019 = 100)", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "State ladder");
    await page
      .getByText("State non-public ladder", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Homeschool");
    await clickBtn(page, "Private");
    await clickBtn(page, "Private + home");
    await clickBtn(page, "Public vs school-age");
    await page
      .getByText("Public enrollment change vs school-age change", {
        exact: false,
      })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Regions");
    await page
      .getByText("Regional non-public mix", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "West");
    await clickBtn(page, "All");
    await clickBtn(page, "From 2019");
    await clickBtn(page, "From 2016");
    await clickBtn(page, "Non-public shares");
    console.log("✓ view + window + region + metric controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ homeschool-and-private-share-of-school-age-kids-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
