/**
 * QA: hospital-system-clout-vs-commercial-prices-2026
 * // viz-types: HHI-band bars, metro HHI×ratio scatter, vintage area+line, service-line bars, top-system ladder, residual bars | layout: default
 * // smoke-marker: Hospital clout · commercial prices
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  HHI_BANDS,
  METRO_PANEL,
  RESIDUALS,
  SERVICE_LINES,
  TOP_SYSTEMS,
  VINTAGE_PATH,
} from "../src/data/hospital-system-clout-vs-commercial-prices-2026-data.ts";

assert.equal(HEADLINE.nationalCommercialToMedicarePct, 254);
assert.equal(HEADLINE.lowHhiMeanRatioPct, 218);
assert.equal(HEADLINE.highHhiMeanRatioPct, 289);
assert.equal(HEADLINE.veryHighHhiMeanRatioPct, 312);
assert.equal(HEADLINE.highVsLowGapPp, 71);
assert.equal(HEADLINE.highlyConcentratedSharePct, 72);
assert.ok(HHI_BANDS.length >= 4);
assert.ok(METRO_PANEL.length >= 20);
assert.ok(SERVICE_LINES.length >= 5);
assert.ok(VINTAGE_PATH.length >= 5);
assert.ok(TOP_SYSTEMS.length >= 6);
assert.ok(RESIDUALS.length >= 4);

const root = process.cwd();
const slug = "hospital-system-clout-vs-commercial-prices-2026";
const markers = [
  "Hospital clout · commercial prices",
  "Commercial-to-Medicare",
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
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 25000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "HHI bands");
    await clickBtn(page, "Metros");
    await clickBtn(page, "Price ratio");
    await clickBtn(page, "Top-1 share");
    await clickBtn(page, "South");
    await clickBtn(page, "All");
    await clickBtn(page, "Services");
    await clickBtn(page, "Path");
    await clickBtn(page, "HHI bands");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
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
