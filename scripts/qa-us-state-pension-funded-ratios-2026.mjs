/**
 * QA: us-state-pension-funded-ratios-2026
 * // viz-types: funded histogram bars, UAAL concentration area, top-UAAL bars, funded×UAAL scatter, CRR/Equable path lines, tercile bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  STATES_2025,
  TOP_UAAL,
  UAAL_CONCENTRATION,
} from "../src/data/us-state-pension-funded-ratios-2026-data.ts";

assert.equal(HEADLINE.nationalFundedRatioPct, 82.5);
assert.equal(HEADLINE.nationalUaalTrillion, 1.27);
assert.ok(HEADLINE.top5UaalSharePct > 50);
assert.ok(HEADLINE.top2UaalSharePct > 30);
assert.ok(STATES_2025.length >= 50);
assert.ok(TOP_UAAL.length >= 10);
assert.ok(UAAL_CONCENTRATION.length >= 20);

const root = process.cwd();
const slug = "us-state-pension-funded-ratios-2026";
const markers = [
  "State pensions · funded ratios & UAAL",
  "Top 5 states hold",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "UAAL share");
    await clickBtn(page, "Funded bins");
    await clickBtn(page, "Funded %");
    await clickBtn(page, "UAAL $");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "Funded × UAAL");
    await clickBtn(page, "National path");
    await clickBtn(page, "UAAL share");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
      maxCharts: 4,
    });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
