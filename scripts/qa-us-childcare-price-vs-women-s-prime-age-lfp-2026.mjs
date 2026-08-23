/**
 * QA: us-childcare-price-vs-women-s-prime-age-lfp-2026
 * // viz-types: dual-axis composed area+lines, YoY bars+lead line, monthly recovery area+line, parent grouped bars+table, state ladder bars, price×LFP scatter | layout: default
 * // smoke-marker: CPI childcare vs LFP
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  MONTHLY_PATH,
  NATIONAL_ANNUAL,
  PARENT_LFP_2024,
  PRICE_GAP_PATH,
  STATE_PRICES,
} from "../src/data/us-childcare-price-vs-women-s-prime-age-lfp-2026-data.ts";

assert.equal(HEADLINE.childcareCpiPct2019_2024, 21.2);
assert.equal(HEADLINE.primeAgeFemaleLfp2024, 77.9);
assert.equal(HEADLINE.mothersUnder6Lfp2024, 68.3);
assert.equal(HEADLINE.childcareYoy2024, 5.3);
assert.ok(NATIONAL_ANNUAL.length >= 10);
assert.ok(MONTHLY_PATH.length >= 12);
assert.ok(STATE_PRICES.length >= 20);
assert.ok(PARENT_LFP_2024.length >= 3);
assert.ok(PRICE_GAP_PATH.length >= 5);
assert.ok(ANALYTICS.primeAgeLfpGainPp2019_2024 >= 1.5);
assert.ok(ANALYTICS.mothersUnder6DropPp2023_2024 >= 0.5);

const root = process.cwd();
const slug = "us-childcare-price-vs-women-s-prime-age-lfp-2026";
const markers = ["CPI childcare vs LFP", "Daycare CPI"];

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
    await clickBtn(page, "YoY diverge");
    await clickBtn(page, "Recovery path");
    await clickBtn(page, "Parent gap");
    await clickBtn(page, "State prices");
    await clickBtn(page, "Price × LFP");
    await clickBtn(page, "CPI vs LFP");
    const audit = await auditVizInteractions(page, { slug });
    console.log(`✓ viz interaction audit: ${audit.clicked} controls`);
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
