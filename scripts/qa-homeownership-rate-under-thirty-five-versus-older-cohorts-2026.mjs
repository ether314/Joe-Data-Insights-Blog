/**
 * QA: homeownership-rate-under-thirty-five-versus-older-cohorts-2026
 * // smoke-marker: Age ladder snapshot
 * // viz-types: ladder bars, dual-path composed, gap area, price scatter,
 * // ACS vs HVS bars, regional gap bars
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGE_LADDER,
  ANNUAL_BY_AGE,
  HEADLINE,
  PRICE_VS_YOUNG,
  QUARTERLY_SINCE_2019,
  REGION_GAPS,
  VIZ_MARKERS,
} from "../src/data/homeownership-rate-under-thirty-five-versus-older-cohorts-2026-data.ts";

assert.equal(HEADLINE.under35_2026q2, 35.2);
assert.equal(HEADLINE.age65plus_2026q2, 78.6);
assert.equal(HEADLINE.gap_2026q2, 43.4);
assert.equal(HEADLINE.gap_2019q2, 41.6);
assert.equal(HEADLINE.gapWidenPpSince2019q2, 1.8);
assert.ok(ANNUAL_BY_AGE.length >= 25);
assert.ok(QUARTERLY_SINCE_2019.length >= 20);
assert.ok(AGE_LADDER.length === 5);
assert.ok(PRICE_VS_YOUNG.length >= 6);
assert.ok(REGION_GAPS.length === 4);
assert.ok(
  Math.abs(HEADLINE.age65plus_2026q2 - HEADLINE.under35_2026q2 - HEADLINE.gap_2026q2) < 0.05,
);

const root = process.cwd();
const slug = "homeownership-rate-under-thirty-five-versus-older-cohorts-2026";

const PANEL_CLICKS = [
  { btn: "Age ladder", title: VIZ_MARKERS[0] },
  { btn: "Dual path", title: VIZ_MARKERS[1] },
  { btn: "Ownership gap", title: VIZ_MARKERS[2] },
  { btn: "Prices vs young", title: VIZ_MARKERS[3] },
  { btn: "ACS vs HVS", title: VIZ_MARKERS[4] },
  { btn: "Regional gap", title: VIZ_MARKERS[5] },
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(250);
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

    for (const { btn, title } of PANEL_CLICKS) {
      await clickBtn(page, btn);
      await page.getByText(title, { exact: false }).first().waitFor({
        state: "visible",
        timeout: 10000,
      });
      console.log(`✓ ${title}`);
    }

    await page.locator("select").nth(1).selectOption("since2019").catch(() => {});
    await page.locator("select").first().selectOption("under35").catch(() => {});
    await clickBtn(page, "Age ladder");

    const audit = await auditVizInteractions(page, slug);
    console.log("interaction audit", audit);
    assert.ok(audit.ok !== false);

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
