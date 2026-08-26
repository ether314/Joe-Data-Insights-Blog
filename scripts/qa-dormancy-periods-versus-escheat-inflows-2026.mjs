/**
 * QA: dormancy-periods-versus-escheat-inflows-2026
 * // viz-types: composed area+line, bar, scatter, horizontal bar, pie, area+bar | layout: default
 * // smoke-marker: Inflow change vs reunification
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ADOPTION_WAVE,
  ANALYTICS,
  COHORT_AGG,
  HEADLINE,
  NATIONAL_SERIES,
  STATE_PANEL,
  TRIGGER_MIX,
} from "../src/data/dormancy-periods-versus-escheat-inflows-2026-data.ts";

assert.equal(HEADLINE.medianInflowDeltaPct, 34);
assert.equal(HEADLINE.medianHoldoutInflowDeltaPct, 9);
assert.equal(HEADLINE.medianReunificationDeltaPp, 0.4);
assert.equal(HEADLINE.jurisdictionsShortened, 17);
assert.equal(HEADLINE.inflowUpReunifFlat, 8);
assert.equal(HEADLINE.nationalReturnsFy2024B, 4.49);
assert.ok(STATE_PANEL.length >= 18);
assert.ok(NATIONAL_SERIES.length >= 10);
assert.equal(NATIONAL_SERIES.at(-1)?.returnsB, 4.49);
assert.ok(COHORT_AGG.length === 2);
assert.ok(TRIGGER_MIX.length === 3);
assert.ok(ADOPTION_WAVE.length >= 8);
assert.equal(ANALYTICS.smokeMarker, "Inflow change vs reunification");

const short = STATE_PANEL.filter((r) => r.cohort === "shortened");
const hold = STATE_PANEL.filter((r) => r.cohort === "holdout");
assert.equal(short.length, HEADLINE.panelShorteners);
assert.equal(hold.length, HEADLINE.panelHoldouts);

const root = process.cwd();
const slug = "dormancy-periods-versus-escheat-inflows-2026";
const markers = [
  "Inflow change vs reunification",
  "Finance · Inflow change vs reunification",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
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
    await clickBtn(page, "Cohort gap");
    await clickBtn(page, "Δ scatter");
    await clickBtn(page, "State ladder");
    await page.locator("select").nth(0).selectOption("northeast");
    console.log("→ region northeast");
    await page.locator("select").nth(1).selectOption("shortened");
    console.log("→ cohort shortened");
    await page.locator("select").nth(2).selectOption("reunifDelta");
    console.log("→ sort reunifDelta");
    await clickBtn(page, "Trigger mix");
    await clickBtn(page, "Adoption wave");
    await clickBtn(page, "National path");
    await clickBtn(page, "Reunification %");
    await clickBtn(page, "Inflows + returns");
    await page.locator("select").nth(0).selectOption("all");
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
