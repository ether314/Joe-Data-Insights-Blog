/**
 * QA: social-housing-stock-share-in-oecd-2026
 * // smoke-marker: Social rental % of dwellings
 * // viz-types: horizontal share bars, diverging decade-delta bars, stacked provider bars, share-vs-change scatter, size-band donut | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_STOCK,
  HEADLINE,
  PROVIDER_MIX,
  VIZ_MARKERS,
  countriesWithTrendPair,
} from "../src/data/social-housing-stock-share-in-oecd-2026-data.ts";

assert.ok(HEADLINE.oecdAverageSharePct > 6.5 && HEADLINE.oecdAverageSharePct < 7.5);
assert.equal(HEADLINE.countriesAbove20, 3);
assert.equal(HEADLINE.largestShareCountry, "Netherlands");
assert.ok(HEADLINE.largestSharePct > 33);
assert.ok(COUNTRY_STOCK.length >= 28);
assert.ok(countriesWithTrendPair().length >= 20);
assert.ok(PROVIDER_MIX.length >= 8);
assert.ok(VIZ_MARKERS.length >= 4);

const nld = COUNTRY_STOCK.find((c) => c.id === "nld");
assert.ok(nld && nld.shareLatestPct > 30);
const pol = COUNTRY_STOCK.find((c) => c.id === "pol");
assert.ok(pol && (pol.changePp ?? 0) < -3);

const root = process.cwd();
const slug = "social-housing-stock-share-in-oecd-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4188);
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

    await clickBtn(page, "Share ladder");
    await clickBtn(page, "Decade delta");
    await clickBtn(page, "Provider mix");
    await clickBtn(page, "Stock vs change");
    await clickBtn(page, "Size bands");
    await clickBtn(page, "≥20%");
    await clickBtn(page, "All countries");
    await clickBtn(page, "Decline first");
    await clickBtn(page, "Share ↓");

    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
