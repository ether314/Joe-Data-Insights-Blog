/**
 * QA: demographic-cash-flows-concentration-202608
 * // viz-types: triple vintage bars, Lorenz area+line, top-3 donut, dual-pulse bars, Mexico share path, corridor delta, dual-ledger scatter | layout: default
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
  RECIPIENT_SHARES_T12M,
} from "../src/data/demographic-cash-flows-concentration-202608-data.ts";

assert.equal(HEADLINE.top1RecipientSharePct, 19);
assert.equal(HEADLINE.top3RecipientSharePct, 35);
assert.equal(HEADLINE.mexicoT12mSharePct, 9.3);
assert.equal(HEADLINE.mexicoBanxicoSharePct, 9.0);
assert.equal(HEADLINE.mexicoRealJuneYoyPct, -8.3);
assert.equal(HEADLINE.top1CorridorSharePct, 8);
assert.equal(HEADLINE.top1CorridorT12mImpliedSharePct, 9.3);
assert.equal(HEADLINE.top1DependenceGdpPct, 45);
assert.equal(HEADLINE.top1PensionGdpPct, 16.3);
assert.equal(RECIPIENT_SHARES_T12M[0].id, "india");
assert.equal(RECIPIENT_SHARES_T12M[0].sharePct, 18.8);
assert.equal(RECIPIENT_SHARES_T12M[1].id, "mexico");
assert.equal(RECIPIENT_SHARES_T12M[1].sharePct, 9.3);
assert.equal(CORRIDOR_SHARES[0].id, "us-mx");
assert.equal(CORRIDOR_SHARES[0].amountBn, 52);

const root = process.cwd();
const slug = "demographic-cash-flows-concentration-202608";
const markers = [
  "Demographic cash flows — Aug 202608 concentration lens",
  "Brief 41 → Banxico FY → T12M",
  "Top-3 vs residual (T12M Mexico)",
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
    await page.waitForSelector(
      '[data-viz="demographic-cash-flows-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Recipient ladder");
    await clickBtn(page, "Brief 41");
    await clickBtn(page, "Banxico FY");
    await clickBtn(page, "T12M Jun’26");
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
    console.log("qa-demographic-cash-flows-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
