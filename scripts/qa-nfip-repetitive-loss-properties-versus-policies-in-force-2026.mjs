/**
 * QA: nfip-repetitive-loss-properties-versus-policies-in-force-2026
 * // viz-types: paired horizontal bars, stock area+line, era dual composed, mitigation pie, state bars, ML×SRL scatter | layout: default
 * // smoke-marker: RL share of policies and of paid losses
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BOOK_SPLIT,
  ERA_COMPARE,
  HEADLINE,
  MITIGATION_METHODS,
  RL_STOCK,
  STATE_MULTIPLE_LOSS,
} from "../src/data/nfip-repetitive-loss-properties-versus-policies-in-force-2026-data.ts";

assert.equal(HEADLINE.rlPolicySharePct, 2.5);
assert.equal(HEADLINE.multiLossClaimSharePct, 48);
assert.equal(HEADLINE.rlInsuredCount, 112_640);
assert.equal(HEADLINE.policiesInForceM, 4.58);
assert.ok(BOOK_SPLIT.length === 2);
assert.ok(RL_STOCK.length === 3);
assert.ok(ERA_COMPARE.length === 2);
assert.ok(MITIGATION_METHODS.length >= 3);
assert.ok(STATE_MULTIPLE_LOSS.length >= 8);

const root = process.cwd();
const slug = "nfip-repetitive-loss-properties-versus-policies-in-force-2026";
const markers = ["RL share of policies and of paid losses"];

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
    await clickBtn(page, "Book split");
    await clickBtn(page, "RL only");
    await clickBtn(page, "Rest of book");
    await clickBtn(page, "Full book");
    await clickBtn(page, "RL stock growth");
    await clickBtn(page, "Era comparison");
    await clickBtn(page, "Mitigation mix");
    await clickBtn(page, "State inventory");
    await clickBtn(page, "Severe RL");
    await clickBtn(page, "Multiple loss");
    await clickBtn(page, "ML × SRL scatter");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed", err);
  process.exit(1);
});
