/**
 * QA: health-insurance-coverage-gaps-census-2026
 * // smoke-marker: Working-age uninsured — Texas 21.6%
 * // viz-types: national composed area+line, state ladder bars,
 * // unwinding delta scatter, expansion compare bars, age/demo bars,
 * // biggest-moves diverging | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGE_BANDS,
  BIGGEST_MOVES,
  DEMO_GAPS,
  EXPANSION_COMPARE,
  HEADLINE,
  NATIONAL_VINTAGE,
  REGION_SUMMARY,
  STATE_GAPS,
  VIZ_MARKERS,
} from "../src/data/health-insurance-coverage-gaps-census-2026-data.ts";

assert.equal(HEADLINE.usWorkingAge2024, 11.3);
assert.equal(HEADLINE.usWorkingAge2023, 11.0);
assert.equal(HEADLINE.texasRate2024, 21.6);
assert.equal(HEADLINE.massRate2024, 3.7);
assert.equal(HEADLINE.statesSigIncrease, 18);
assert.equal(HEADLINE.statesSigDecrease, 3);
assert.ok(STATE_GAPS.length === 51);
assert.ok(NATIONAL_VINTAGE.length >= 5);
assert.ok(AGE_BANDS.length >= 3);
assert.ok(DEMO_GAPS.length >= 4);
assert.ok(EXPANSION_COMPARE.length === 3);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(BIGGEST_MOVES.length >= 8);
assert.equal(
  STATE_GAPS.find((s) => s.abbr === "TX")?.rate2024,
  HEADLINE.texasRate2024,
);

const root = process.cwd();
const slug = "health-insurance-coverage-gaps-census-2026";
const markers = [...VIZ_MARKERS];

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

    await clickBtn(page, "State ladder");
    await clickBtn(page, "Sort by delta");
    await clickBtn(page, "South");
    await clickBtn(page, "Non-expansion");
    await clickBtn(page, "All expansion");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Unwinding delta");
    await page.getByText("Unwinding delta scatter", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "National path");
    await page
      .getByText("National path through continuous enrollment", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Expansion gap");
    await page.getByText("Expansion gap", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Age & race");
    await page.getByText("Age bands", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Biggest movers");
    await page.getByText("Biggest movers", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ panel + region + expansion + sort controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ health-insurance-coverage-gaps-census-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
