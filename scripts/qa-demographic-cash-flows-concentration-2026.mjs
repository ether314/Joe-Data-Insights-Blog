/**
 * QA: demographic-cash-flows-concentration-2026
 * // viz-types: Lorenz area+line, ranked bars, recipient pie, lens scatter, dual-ledger scatter, flow bars | layout: default
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
  RECIPIENT_SHARES,
} from "../src/data/demographic-cash-flows-concentration-2026-data.ts";

assert.equal(HEADLINE.top1RecipientSharePct, 19);
assert.equal(HEADLINE.top3RecipientSharePct, 36);
assert.equal(HEADLINE.top1CorridorSharePct, 8);
assert.equal(HEADLINE.top1DependenceGdpPct, 45);
assert.equal(HEADLINE.top1PensionGdpPct, 16.3);
assert.equal(RECIPIENT_SHARES[0].id, "india");
assert.equal(RECIPIENT_SHARES[0].sharePct, 18.8);
assert.equal(CORRIDOR_SHARES[0].id, "us-mx");
assert.equal(CORRIDOR_SHARES[0].amountBn, 52);

const root = process.cwd();
const slug = "demographic-cash-flows-concentration-2026";
const markers = [
  "Demographic cash flows — concentration lens",
  "Cumulative share vs equal split",
  "LMIC recipient dollar ladder",
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
    await page.waitForSelector(
      '[data-viz="demographic-cash-flows-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Corridor pipes");
    await clickBtn(page, "$ billions");
    await clickBtn(page, "GDP dependence");
    await clickBtn(page, "Host pensions");
    await clickBtn(page, "Recipient ladder");
    await clickBtn(page, "Corridors");
    await clickBtn(page, "Cumulative");
    await clickBtn(page, "Equal split");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-demographic-cash-flows-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
