/**
 * QA: blast-furnace-vs-eaf-steel-by-country-2026
 * // viz-types: stacked BF/EAF bars, BF-share ladder, peer contrast bars, global route donut, intensity path composed, BF-share vs intensity scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_ROUTES,
  HEADLINE,
  INTENSITY_PATH,
  PEER_CONTRAST,
  ROUTE_STACK,
  VIZ_MARKERS,
} from "../src/data/blast-furnace-vs-eaf-steel-by-country-2026-data.ts";

assert.equal(HEADLINE.chinaBfSharePct, 89.6);
assert.equal(HEADLINE.usEafSharePct, 69.8);
assert.equal(HEADLINE.globalBfSharePct, 71.2);
assert.equal(HEADLINE.indiaBfSharePct, 54.8);
assert.equal(HEADLINE.eu27EafSharePct, 43.6);
assert.ok(COUNTRY_ROUTES.length >= 12);
assert.ok(ROUTE_STACK.length >= 6);
assert.ok(PEER_CONTRAST.length >= 4);
assert.ok(INTENSITY_PATH.length >= 5);
assert.ok(HEADLINE.chinaBfSharePct > HEADLINE.usEafSharePct);

const root = process.cwd();
const slug = "blast-furnace-vs-eaf-steel-by-country-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4180);
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Route stack & ladder");
    await clickBtn(page, "BF share");
    await clickBtn(page, "EAF share");
    await clickBtn(page, "Crude Mt");
    await clickBtn(page, "Process Mt");
    await clickBtn(page, "Asia");
    await clickBtn(page, "All");
    await clickBtn(page, "Peer contrast");
    await clickBtn(page, "Intensity path");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Route stack & ladder");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
      maxCharts: 4,
    });
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
