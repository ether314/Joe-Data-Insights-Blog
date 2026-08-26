/**
 * QA: forest-service-suppression-spend-versus-fuels-acres-treated-2026
 * // viz-types: dual composed bars+line, per-acre line, era group bars, treatment-mix pie, WUI stacked area, suppress×fuels scatter | layout: default
 * // smoke-marker: Suppression $ vs fuels acres
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL,
  FY2024_FUELS,
  HEADLINE,
  dualSeries,
  eraSummary,
  suppressPerAcre,
  treatmentMixForFy,
} from "../src/data/forest-service-suppression-spend-versus-fuels-acres-treated-2026-data.ts";

assert.equal(HEADLINE.fy2010SuppressM, 578);
assert.equal(HEADLINE.peakSuppressM, 3741);
assert.equal(HEADLINE.fy2023SuppressM, 2700);
assert.equal(HEADLINE.fy2010PerAcre, 177);
assert.equal(HEADLINE.peakPerAcre, 1116);
assert.equal(HEADLINE.fy2023PerAcre, 693);
assert.ok(ANNUAL.length >= 14);
assert.equal(ANNUAL[0].fy, 2010);
assert.equal(ANNUAL[ANNUAL.length - 1].fy, 2023);
assert.ok(FY2024_FUELS.fuelsAcres > 3_000_000);
assert.ok(dualSeries().length === ANNUAL.length);
assert.ok(eraSummary().length === 3);
assert.ok(treatmentMixForFy(2023).length === 4);
assert.ok(Math.round(suppressPerAcre(ANNUAL[0])) === 177);

const root = process.cwd();
const slug = "forest-service-suppression-spend-versus-fuels-acres-treated-2026";
const markers = [
  "Suppression $ vs fuels acres",
  "Suppression outlays versus fuels acres treated",
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
    await clickBtn(page, "$ / acre");
    await clickBtn(page, "Era averages");
    await clickBtn(page, "Treatment mix");
    await clickBtn(page, "WUI share");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "2021–23");
    await clickBtn(page, "Dual track");
    await clickBtn(page, "FY2010=100");
    await clickBtn(page, "All eras");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
