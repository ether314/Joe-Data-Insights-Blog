/**
 * QA: hospital-charity-care-versus-collection-suits-2026
 * // smoke-marker: Suits per charity-care dollar
 * // viz-types: intensity ladder bars, charity×suits scatter, vintage
 * // area+line, suit-band pie + peer bars, region stacks, billing grades
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BILLING_GRADE_MIX,
  HEADLINE,
  HOSPITAL_PANEL,
  PEER_COMPARE,
  REGION_SUMMARY,
  STATE_LADDER,
  SUIT_BAND_MIX,
  VINTAGE_PATH,
  VIZ_MARKERS,
} from "../src/data/hospital-charity-care-versus-collection-suits-2026-data.ts";

assert.equal(HEADLINE.panelN, 28);
assert.equal(HEADLINE.suingHospitals, 16);
assert.equal(HEADLINE.medianSuitsPerCharityM, 4.8);
assert.equal(HEADLINE.peerMedianSuitsPerCharityM, 0.3);
assert.equal(HEADLINE.aggressiveCharityPct, 1.1);
assert.equal(HEADLINE.nonsuingCharityPct, 2.9);
assert.equal(HEADLINE.intensityMultiple, 16);
assert.equal(HOSPITAL_PANEL.length, HEADLINE.panelN);
assert.ok(VINTAGE_PATH.length >= 8);
assert.ok(STATE_LADDER.length >= 10);
assert.ok(PEER_COMPARE.length === 4);
assert.ok(SUIT_BAND_MIX.length === 4);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(BILLING_GRADE_MIX.some((g) => g.grade === "A" && g.hospitals > 0));
assert.ok(
  HOSPITAL_PANEL.every((h) => h.suitsPerCharityM === 0 || h.charityM > 0),
);

const root = process.cwd();
const slug = "hospital-charity-care-versus-collection-suits-2026";
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

    await clickBtn(page, "Charity × suits");
    await clickBtn(page, "Y: suits / $1M");
    await clickBtn(page, "South");
    await clickBtn(page, "Community");
    await clickBtn(page, "Vintage path");
    await page.getByText("Suits vs charity-care dollars over time", {
      exact: false,
    }).first().waitFor({ timeout: 10000 });
    await clickBtn(page, "Peers & bands");
    await page.getByText("Suit-band mix", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Regions & states");
    await page.getByText("Regional intensity", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Billing grades");
    await page
      .getByText("Lown-style billing grade vs suit intensity", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Intensity ladder");
    console.log("✓ panel + region + peer + lens controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ hospital-charity-care-versus-collection-suits-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
