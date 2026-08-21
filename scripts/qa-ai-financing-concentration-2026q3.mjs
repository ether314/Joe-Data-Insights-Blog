/**
 * QA: ai-financing-concentration-2026q3
 * // viz-types: Lorenz area+line, ranked bars, stack donut, supply path, vintage share path, channel bars, ETF pie, lens scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AI_DEBT_STACK,
  ETF_FLOW_SHARES,
  HEADLINE,
  ISSUER_SHARES,
  ISSUER_SHARE_PATH,
} from "../src/data/ai-financing-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1IssuerSharePct, 39);
assert.equal(HEADLINE.top3IssuerSharePct, 74);
assert.equal(HEADLINE.hsShareOfAiDebtPct, 42);
assert.equal(HEADLINE.top1EtfSharePct, 50);
assert.equal(HEADLINE.aiIgSupplySharePct, 23);
assert.equal(HEADLINE.issuerUniverseBn, 218);
assert.equal(ISSUER_SHARES[0].short, "AMZN");
assert.equal(ISSUER_SHARES[0].sharePct, 39);
assert.equal(AI_DEBT_STACK[0].sharePct, 42);
assert.equal(ETF_FLOW_SHARES[0].ticker, "QQQ");
assert.ok(ISSUER_SHARE_PATH.length >= 2);

const root = process.cwd();
const slug = "ai-financing-concentration-2026q3";
const markers = [
  "AI financing — Q3 concentration lens",
  "Cumulative share vs equal split",
  "Hyperscaler IG issuer ladder",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  await page
    .locator("button", { hasText: new RegExp(`^${escaped}$`) })
    .first()
    .click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="ai-financing-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Theme stack");
    await clickBtn(page, "Credit channels");
    await clickBtn(page, "$ billions");
    await clickBtn(page, "ETF + lenses");
    await clickBtn(page, "Issuer ladder");
    await clickBtn(page, "Channels");
    await clickBtn(page, "Cumulative");
    await clickBtn(page, "Share %");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-financing-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
