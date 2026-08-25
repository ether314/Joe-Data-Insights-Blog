/**
 * QA: high-propensity-applications-vs-employer-firms-2026
 * // viz-types: horizontal bar, composed bar+line, scatter, grouped bar, multi-line | layout: default
 * // smoke-marker: Business formation applications
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL,
  HEADLINE,
  QUARTERLY,
  REGIONS,
  STATES,
} from "../src/data/high-propensity-applications-vs-employer-firms-2026-data.ts";

assert.equal(HEADLINE.usAppsPerEmployer, 4.38);
assert.equal(HEADLINE.usConversionPct, 22.8);
assert.equal(HEADLINE.lowestAppsState, "SD");
assert.equal(HEADLINE.highestAppsState, "MS");
assert.equal(HEADLINE.lowestAppsPerEmployer, 2.61);
assert.equal(HEADLINE.highestAppsPerEmployer, 7.45);
assert.equal(HEADLINE.statesAbove4, 28);
assert.equal(HEADLINE.statesBelow3, 10);
assert.ok(STATES.length === 51);
assert.ok(ANNUAL.length >= 8);
assert.ok(QUARTERLY.length >= 20);
assert.ok(REGIONS.length === 4);
assert.equal(ANALYTICS.defaultPanel, "state-ladder");

const ms = STATES.find((s) => s.code === "MS");
const sd = STATES.find((s) => s.code === "SD");
assert.ok(ms && sd);
assert.equal(ms.appsPerEmployer, 7.45);
assert.equal(sd.appsPerEmployer, 2.61);

const root = process.cwd();
const slug = "high-propensity-applications-vs-employer-firms-2026";
const markers = [
  "Business formation applications",
  "High-propensity applications vs employer firms",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Conversion proxy");
    await clickBtn(page, "South");
    await clickBtn(page, "National dual");
    await clickBtn(page, "Volume scatter");
    await clickBtn(page, "West");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Annual path");
    await clickBtn(page, "Apps / employer");
    await clickBtn(page, "All");
    await clickBtn(page, "HBA volume");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length > 0) {
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
