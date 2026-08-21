/**
 * QA: bank-commercial-credit-concentration-2026q3
 * // viz-types: vintage restatement bars, deposit Lorenz area+line, bank share bars, CRE composed, HHI bars, SLOOS net bars, CMBS MoM dual, stress scatter, CMBS pie | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BANK_SHARES,
  CRE_COHORTS,
  HEADLINE,
} from "../src/data/bank-commercial-credit-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1BankSharePct, 12.8);
assert.equal(HEADLINE.top3BankSharePct, 33.4);
assert.equal(HEADLINE.cmbsOverallDelinqPct, 7.86);
assert.equal(HEADLINE.sloosCreNfnrNet, -11.3);
assert.equal(HEADLINE.officeCmbsStressSharePct, 42);
assert.equal(BANK_SHARES[0].short, "JPM");
assert.equal(CRE_COHORTS.find((c) => c.id === "community")?.creCapitalPct, 311);

const root = process.cwd();
const slug = "bank-commercial-credit-concentration-2026q3";
const markers = [
  "Bank & commercial credit — Q3 concentration lens",
  "Q3 vs prior concentration restatement",
  "Cross-lens: top-1 vs thick top",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  const btn = page.locator("button", { hasText: name }).first();
  await btn.scrollIntoViewIfNeeded();
  await btn.click({ timeout: 8000, force: true });
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
    await page.waitForSelector(
      '[data-viz="bank-commercial-credit-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Bank shares");
    await page.getByText("Deposit Lorenz vs equal share", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ Deposit Lorenz vs equal share");
    await clickBtn(page, "Assets");
    await clickBtn(page, "CRE cohorts");
    await clickBtn(page, "CRE PDNA %");
    await clickBtn(page, "Stress + HHI");
    await clickBtn(page, "Delinquency $");
    await clickBtn(page, "Supply + CMBS");
    await clickBtn(page, "Δ vs prior est.");
    await clickBtn(page, "MoM Δ pp");
    await clickBtn(page, "Scoreboard");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
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
