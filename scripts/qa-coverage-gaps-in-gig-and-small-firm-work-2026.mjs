/**
 * QA: coverage-gaps-in-gig-and-small-firm-work-2026
 * // viz-types: offer ladder bars, MEPS composed (area+line), SHED radar,
 * // cascade horizontal bars, gap scatter, contribution grouped bars |
 * // layout: default | controls: view + gig segment + ladder focus
 * // smoke-marker: Offer-rate gap by firm type
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MEPS_ENROLLMENT_TREND,
  OFFER_LADDER,
  SHED_COVERAGE,
} from "../src/data/coverage-gaps-in-gig-and-small-firm-work-2026-data.ts";

assert.equal(HEADLINE.largeFirmOfferPct, 97);
assert.equal(HEADLINE.smallFirmOfferPct, 59);
assert.equal(HEADLINE.offerGapPpt, 38);
assert.equal(HEADLINE.microFirmOfferPct, 51);
assert.equal(HEADLINE.mepsSmallEnrollPct, 26.8);
assert.equal(HEADLINE.mepsLargeEnrollPct, 54.3);
assert.equal(HEADLINE.shedGigAnyInsurancePct, 88);
assert.ok(OFFER_LADDER.length >= 5);
assert.ok(MEPS_ENROLLMENT_TREND.length >= 5);
assert.ok(SHED_COVERAGE.length >= 5);

const root = process.cwd();
const slug = "coverage-gaps-in-gig-and-small-firm-work-2026";
const markers = [
  "Offer-rate gap by firm type",
  "Coverage Gaps in Gig and Small-Firm Work",
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
    await clickBtn(page, "Enrollment");
    await clickBtn(page, "Gig SHED");
    await clickBtn(page, "Platform");
    await clickBtn(page, "Cascade");
    await clickBtn(page, "Offer gap");
    await clickBtn(page, "Small cuts");
    await clickBtn(page, "All sizes");
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
