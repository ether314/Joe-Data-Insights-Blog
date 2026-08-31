/**
 * QA: high-hazard-potential-dams-without-emergency-action-plans-2026
 * // viz-types: donut status, area coverage trend, division gap bars, ownership composed, condition stacked, state scatter | layout: default
 * // smoke-marker: High-hazard dams lacking an EAP
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DIVISION_EAP_GAPS,
  EAP_COVERAGE_TREND,
  EAP_STATUS_SPLIT,
  HEADLINE,
  OWNERSHIP_EAP_COMPARE,
  STATE_EAP_PANEL,
} from "../src/data/high-hazard-potential-dams-without-emergency-action-plans-2026-data.ts";

assert.equal(HEADLINE.withoutEapSharePct, 18);
assert.equal(HEADLINE.eapSharePct, 82);
assert.equal(HEADLINE.stateRegulatedWithoutEap, 2415);
assert.equal(HEADLINE.stateRegulatedWithEap, 11000);
assert.equal(HEADLINE.nidHighHazard, 16700);
assert.ok(EAP_STATUS_SPLIT.length === 2);
assert.ok(EAP_COVERAGE_TREND.length >= 6);
assert.ok(DIVISION_EAP_GAPS.length === 9);
assert.ok(OWNERSHIP_EAP_COMPARE.length >= 3);
assert.ok(STATE_EAP_PANEL.length >= 8);
assert.equal(
  DIVISION_EAP_GAPS.reduce((s, r) => s + r.hhpDams, 0),
  HEADLINE.stateRegulatedHhp,
);
assert.equal(
  DIVISION_EAP_GAPS.reduce((s, r) => s + r.withoutEap, 0),
  HEADLINE.stateRegulatedWithoutEap,
);

const root = process.cwd();
const slug = "high-hazard-potential-dams-without-emergency-action-plans-2026";
const markers = ["High-hazard dams lacking an EAP"];

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
    await clickBtn(page, "Coverage trend");
    await clickBtn(page, "Division gaps");
    await clickBtn(page, "Without-EAP count");
    await clickBtn(page, "Without-EAP share (%)");
    await clickBtn(page, "East South Central");
    await clickBtn(page, "All divisions");
    await clickBtn(page, "Ownership compare");
    await clickBtn(page, "Condition × EAP");
    await clickBtn(page, "State scatter");
    await clickBtn(page, "EAP status");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
