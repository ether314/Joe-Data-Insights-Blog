/**
 * QA: construction-sand-extraction-and-trade-2026
 * // viz-types: extractor bars, region donut, US composed volume+price, importer bars, partner pie, dependence scatter, corridor bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  EXTRACTORS,
  HEADLINE,
  IMPORTERS_2023,
  REGION_DEMAND,
  US_MCS_PATH,
} from "../src/data/construction-sand-extraction-and-trade-2026-data.ts";

assert.equal(HEADLINE.usUsgsMt2025, 870);
assert.equal(HEADLINE.singaporeImportMt2023, 27.4);
assert.equal(HEADLINE.chinaMfaSandMt, 17700);
assert.ok(EXTRACTORS.length >= 8);
assert.ok(IMPORTERS_2023.length >= 10);
assert.ok(REGION_DEMAND.length >= 5);
assert.ok(US_MCS_PATH.length >= 5);
assert.ok(
  Math.abs(REGION_DEMAND.reduce((s, r) => s + r.sharePct, 0) - 100) < 0.6,
);

const root = process.cwd();
const slug = "construction-sand-extraction-and-trade-2026";
const markers = [
  "Construction aggregates · sand extraction & trade",
  "Singapore holds",
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
      `[data-viz="${slug}"]`,
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Extractors");
    await clickBtn(page, "All series");
    await clickBtn(page, "Disclosed only");
    await clickBtn(page, "MFA giants");
    await clickBtn(page, "Importers");
    await clickBtn(page, "Top tonnage");
    await clickBtn(page, "City-state only");
    await clickBtn(page, "All listed");
    await clickBtn(page, "City-states");
    await clickBtn(page, "US MCS path");
    await clickBtn(page, "Extractors");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 12,
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
