/**
 * QA: us-cyber-insurance-premiums-vs-incurred-losses-2026
 * // viz-types: dual-axis composed, loss-ratio area, structure donut, IC3 bars, claim-driver radial, phase scatter | layout: default
 * // smoke-marker: Premium raced ahead of losses
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MARKET_SERIES,
  IC3_THREAT_SERIES,
  POLICY_STRUCTURE_2024,
} from "../src/data/us-cyber-insurance-premiums-vs-incurred-losses-2026-data.ts";

assert.equal(HEADLINE.domesticDwpGrowthPct, 157);
assert.equal(HEADLINE.lossRatio2024Pct, 49);
assert.equal(HEADLINE.lossRatio2023Pct, 42);
assert.ok(MARKET_SERIES.length >= 5);
assert.ok(IC3_THREAT_SERIES.length === 3);
assert.ok(POLICY_STRUCTURE_2024.length === 3);

const root = process.cwd();
const slug = "us-cyber-insurance-premiums-vs-incurred-losses-2026";
const markers = [
  "Premium raced ahead of losses",
  "Premium vs losses",
  "Loss ratio",
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Loss ratio");
    await clickBtn(page, "Policy stack");
    await clickBtn(page, "IC3 threat $");
    await clickBtn(page, "2023");
    await clickBtn(page, "Claim drivers");
    await clickBtn(page, "Hard→soft");
    await clickBtn(page, "Premium vs losses");
    await clickBtn(page, "Incl. alien");
    await clickBtn(page, "$B");
    await clickBtn(page, "Domestic");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
