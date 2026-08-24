/**
 * QA: global-road-deaths-vs-vehicle-stock-2026
 * // viz-types: deaths×fleet scatter, vehicle-risk ladder bars, global path area+line, region stacks, motorization multi-line, income pie | layout: default
 * // smoke-marker: Deaths per 100k vs vehicles
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_PANEL,
  GLOBAL_PATH,
  HEADLINE,
  INCOME_AGG,
  MOTORIZATION_PATHS,
  REGION_AGG,
} from "../src/data/global-road-deaths-vs-vehicle-stock-2026-data.ts";

assert.equal(HEADLINE.globalDeathsPer100kVehicles2021, 47);
assert.equal(HEADLINE.globalDeathsPer100kVehicles2010, 79);
assert.equal(HEADLINE.globalDeathsPer100kVehiclesDropPct, 41);
assert.ok(HEADLINE.kenyaDeathsPer100kVehicles > 350);
assert.ok(HEADLINE.swedenDeathsPer100kVehicles < 4);
assert.ok(COUNTRY_PANEL.length >= 20);
assert.ok(REGION_AGG.length === 6);
assert.ok(INCOME_AGG.length === 4);
assert.ok(GLOBAL_PATH.length >= 4);
assert.ok(MOTORIZATION_PATHS.length >= 18);
const ken = COUNTRY_PANEL.find((r) => r.iso3 === "KEN");
assert.ok(ken && ken.deathsPer100kPop === 28.2);
const swe = COUNTRY_PANEL.find((r) => r.iso3 === "SWE");
assert.ok(swe && swe.deathsPer100kVehicles === 3.3);

const root = process.cwd();
const slug = "global-road-deaths-vs-vehicle-stock-2026";
const markers = [
  "Deaths per 100k vs vehicles",
  "Deaths per 100k population vs vehicles per 1,000",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Risk ladder");
    await clickBtn(page, "Per 100k people");
    await clickBtn(page, "Per 100k vehicles");
    await clickBtn(page, "Global path");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Motorization paths");
    await clickBtn(page, "Income mix");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Africa");
    await clickBtn(page, "All");
    await auditVizInteractions(page, { slug, maxButtons: 16 });
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
