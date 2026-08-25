/**
 * QA: uninsurance-by-state-after-medicaid-unwinding-2026
 * // smoke-marker: Uninsured-rate change after unwinding
 * // viz-types: state pp-change bars, national composed path,
 * // destination pie, medicaid-loss vs pp scatter, cohort bars,
 * // reason stacked bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COHORTS,
  DESTINATIONS,
  HEADLINE,
  NATIONAL_PATH,
  REASON_MIX,
  STATE_PANEL,
  VIZ_MARKERS,
} from "../src/data/uninsurance-by-state-after-medicaid-unwinding-2026-data.ts";

assert.equal(HEADLINE.nationalUninsured2022Pct, 8.0);
assert.equal(HEADLINE.nationalUninsured2024Pct, 8.7);
assert.equal(HEADLINE.nationalPpChange, 0.7);
assert.equal(HEADLINE.medicaidNetLossM, 18.4);
assert.equal(HEADLINE.marketplaceGainM, 6.1);
assert.equal(HEADLINE.topState, "Texas");
assert.equal(HEADLINE.topStatePp, 1.6);
assert.ok(STATE_PANEL.length >= 20);
assert.ok(NATIONAL_PATH.length >= 10);
assert.ok(DESTINATIONS.length >= 5);
assert.ok(COHORTS.length >= 3);
assert.ok(REASON_MIX.length >= 3);
assert.equal(
  DESTINATIONS.reduce((s, d) => s + d.sharePct, 0),
  100,
);

const root = process.cwd();
const slug = "uninsurance-by-state-after-medicaid-unwinding-2026";
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

    await clickBtn(page, "State rate change");
    await clickBtn(page, "Coverage-gap");
    await clickBtn(page, "pp change");
    await clickBtn(page, "2024 rate");
    await clickBtn(page, "National path");
    await page.getByText("Medicaid peak", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Who absorbed churn");
    await page.getByText("Who absorbed the churn", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Loss vs rate rise");
    await clickBtn(page, "Expansion cohorts");
    console.log("✓ panel + status + lens controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ uninsurance-by-state-after-medicaid-unwinding-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
