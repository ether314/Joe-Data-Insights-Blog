/**
 * QA: demographic-cash-flows-concentration-2026q3
 * // viz-types: grouped vintage bars, Lorenz area+line, top-3 donut, H1 rebound line, corridor delta bars, dual-ledger scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CORRIDOR_SHARES,
  HEADLINE,
  RECIPIENT_SHARES_BANXICO,
} from "../src/data/demographic-cash-flows-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1RecipientSharePct, 19);
assert.equal(HEADLINE.top3RecipientSharePct, 35);
assert.equal(HEADLINE.mexicoShareDeltaPp, -0.9);
assert.equal(HEADLINE.top1CorridorSharePct, 8);
assert.equal(HEADLINE.top1CorridorBanxicoImpliedSharePct, 9.0);
assert.equal(HEADLINE.top1DependenceGdpPct, 45);
assert.equal(HEADLINE.top1PensionGdpPct, 16.3);
assert.equal(RECIPIENT_SHARES_BANXICO[0].id, "india");
assert.equal(RECIPIENT_SHARES_BANXICO[0].sharePct, 18.8);
assert.equal(RECIPIENT_SHARES_BANXICO[1].id, "mexico");
assert.equal(RECIPIENT_SHARES_BANXICO[1].sharePct, 9.0);
assert.equal(CORRIDOR_SHARES[0].id, "us-mx");
assert.equal(CORRIDOR_SHARES[0].amountBn, 52);

const root = process.cwd();
const slug = "demographic-cash-flows-concentration-2026q3";
const markers = [
  "Demographic cash flows — Q3 2026 concentration lens",
  "Brief 41 vs Banxico restatement",
  "Top-3 vs residual (Banxico)",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="demographic-cash-flows-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Recipient ladder");
    await clickBtn(page, "Brief 41");
    await clickBtn(page, "Banxico restated");
    await clickBtn(page, "Corridor pipes");
    await clickBtn(page, "Dependence + pensions");
    await clickBtn(page, "Vintage delta");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-demographic-cash-flows-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
