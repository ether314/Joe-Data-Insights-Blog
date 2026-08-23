/**
 * QA: us-counties-with-no-local-news-outlet-2026
 * // viz-types: composed area+line, horiz bars, funnel bars, pie, scatter | layout: default
 * // smoke-marker: Counties with 0–1 local news outlets
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DESERT_PATH,
  HEADLINE,
  RISK_FUNNEL,
  STATE_LIMITED_ACCESS,
} from "../src/data/us-counties-with-no-local-news-outlet-2026-data.ts";

assert.equal(HEADLINE.zeroOutletCounties2025, 212);
assert.equal(HEADLINE.oneOutletCounties2025, 1525);
assert.equal(HEADLINE.limitedAccessCounties2025, 1737);
assert.equal(HEADLINE.watchListCounties, 249);
assert.equal(HEADLINE.limitedAccessPopM, 50);
assert.ok(DESERT_PATH.length >= 6);
assert.ok(STATE_LIMITED_ACCESS.length >= 8);
assert.ok(RISK_FUNNEL.length >= 4);

const root = process.cwd();
const slug = "us-counties-with-no-local-news-outlet-2026";
const markers = [
  "Counties with 0–1 local news outlets",
  "Desert path",
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
    await clickBtn(page, "Desert path");
    await clickBtn(page, "All outlets");
    await clickBtn(page, "Newspaper 0–1");
    await clickBtn(page, "State exposure");
    await clickBtn(page, "South");
    await clickBtn(page, "All");
    await clickBtn(page, "Risk funnel");
    await clickBtn(page, "Ecosystem");
    await clickBtn(page, "Desert path");
    await auditVizInteractions(page, { slug });
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
