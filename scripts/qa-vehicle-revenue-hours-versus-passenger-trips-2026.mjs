/**
 * QA: vehicle-revenue-hours-versus-passenger-trips-2026
 * // smoke-marker: VRH vs UPT dual recovery
 * // viz-types: dual-axis VRH vs UPT composed, trips-per-VRH area path,
 * // mode productivity scatter, agency service-load slope dumbbells
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGENCIES,
  DETAIL_TABLE,
  HEADLINE,
  MODE_GAPS,
  NATIONAL_SERIES,
  VIZ_MARKERS,
} from "../src/data/vehicle-revenue-hours-versus-passenger-trips-2026-data.ts";

assert.equal(AGENCIES.length, HEADLINE.panelN);
assert.equal(AGENCIES.length, 20);
assert.equal(DETAIL_TABLE.length, 20);
assert.ok(MODE_GAPS.length >= 5);
assert.ok(NATIONAL_SERIES.length >= 5);
assert.equal(HEADLINE.vrhIndex2024, 95);
assert.equal(HEADLINE.uptIndex2024, 78);
assert.equal(HEADLINE.tripsPerVrhIndex2024, 82);
assert.equal(HEADLINE.serviceLeadPts, 17);
assert.ok(VIZ_MARKERS.includes("VRH vs UPT dual recovery"));

const root = process.cwd();
const slug = "vehicle-revenue-hours-versus-passenger-trips-2026";
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Trips-per-VRH index path");
    await page
      .getByText("Trips-per-VRH index path", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Mode productivity scatter");
    await page
      .getByText("Mode productivity scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Agency service-load slope");
    await page
      .getByText("Agency service-load slope", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Northeast");
    await clickBtn(page, "Mega");
    await clickBtn(page, "All regions");
    await clickBtn(page, "All sizes");
    await clickBtn(page, "VRH vs UPT dual recovery");
    console.log("✓ view + region + size controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
