/**
 * QA: npl-sites-with-construction-complete-versus-remaining-construction-2026
 * // smoke-marker: Construction-complete share of final NPL
 * // viz-types: split pie, stacked area CC vs remaining, dual-axis RAPC+sitewide,
 * // horizontal pipeline bars, scatter remaining vs CC share, lead-mix bars
 * // | controls: panel, year window | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL_SNAPSHOTS,
  FY2025_SPLIT,
  HEADLINE,
  VIZ_MARKERS,
} from "../src/data/npl-sites-with-construction-complete-versus-remaining-construction-2026-data.ts";

assert.equal(HEADLINE.finalNplFy2025, 1343);
assert.equal(HEADLINE.onFinalCcEst, 788);
assert.equal(HEADLINE.remainingConstructionEst, 555);
assert.equal(HEADLINE.onFinalCcSharePct, 58.7);
assert.equal(HEADLINE.sitewideCcFy2025, 1);
assert.equal(HEADLINE.rapcFy2025, 72);
assert.ok(ANNUAL_SNAPSHOTS.length === 7);
assert.ok(FY2025_SPLIT.length === 2);
assert.ok(VIZ_MARKERS.includes("Construction-complete share of final NPL"));
assert.ok(
  VIZ_MARKERS.includes("788 construction-complete vs 555 still building"),
);

const root = process.cwd();
const slug =
  "npl-sites-with-construction-complete-versus-remaining-construction-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4186);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    assert.ok(loaded, "post HTML not found");

    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 }).catch(() => null);
    await page.getByText(markers[0], { exact: false }).first().waitFor({
      state: "attached",
      timeout: 20000,
    });
    console.log(`✓ ${markers[0]}`);

    await page
      .getByText("788 construction-complete vs 555 still building", {
        exact: false,
      })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ 788 construction-complete vs 555 still building");

    await clickBtn(page, "CC vs remaining");
    await page
      .getByText("Construction-complete vs remaining on the final NPL", {
        exact: false,
      })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "RAPC vs sitewide");
    await page
      .getByText("Sitewide CC pace vs RAPC throughput", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Pipeline bands");
    await page
      .getByText("FY2025 construction pipeline bands", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Remaining vs share");
    await page
      .getByText("Remaining construction vs on-final CC share", {
        exact: false,
      })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "New-start leads");
    await page
      .getByText("Who started remedial construction in FY2025", {
        exact: false,
      })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Milestone ladder");
    await page
      .getByText("FY2025 milestone ladder", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "FY25 split");
    await clickBtn(page, "FY2022–FY2025");
    console.log("✓ view controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
