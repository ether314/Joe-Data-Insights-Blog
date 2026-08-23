/**
 * QA: veterinary-antibiotic-sales-vs-human-use-2026
 * // viz-types: tonnage bars, intensity bars, EU scatter, radar, composed trends, species pie | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ABSOLUTE_TONNAGE,
  ANALYTICS,
  DUAL_AXIS_EU,
  EU_PCU_TREND,
  HEADLINE,
  INTENSITY_LADDER,
  US_SALES_TREND,
  US_SPECIES_SHARE,
} from "../src/data/veterinary-antibiotic-sales-vs-human-use-2026-data.ts";

assert.equal(HEADLINE.jiacraHumanMgPerKg, 125.0);
assert.equal(HEADLINE.jiacraAnimalMgPerKg, 92.6);
assert.equal(HEADLINE.eu2023MgPcu, 88.5);
assert.equal(HEADLINE.us2023MedicallyImportantTonnes, 6100);
assert.equal(HEADLINE.woah2022ReportedTonnes, 70648);
assert.equal(HEADLINE.esacNet2023Ddd, 20.0);
assert.ok(ABSOLUTE_TONNAGE.length >= 5);
assert.ok(INTENSITY_LADDER.length >= 5);
assert.ok(DUAL_AXIS_EU.length >= 6);
assert.ok(EU_PCU_TREND.length >= 5);
assert.ok(US_SALES_TREND.length >= 5);
assert.equal(US_SPECIES_SHARE.length, 5);
assert.ok(ANALYTICS.jiacraAnimalBelowHumanPct > 0);

const root = process.cwd();
const slug = "veterinary-antibiotic-sales-vs-human-use-2026";
const markers = [
  "Metric clash · mg/PCU vs DDD",
  "Livestock antimicrobial mass in large producers",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Intensity ladder");
    await clickBtn(page, "EU animal × human");
    await clickBtn(page, "EU PCU & US path");
    await clickBtn(page, "US tonnes only");
    await clickBtn(page, "EU mg/PCU only");
    await clickBtn(page, "Both series");
    await clickBtn(page, "US species mix");
    await clickBtn(page, "Absolute tonnes");
    await clickBtn(page, "EU-27 only");
    await clickBtn(page, "Global majors + EU");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
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
