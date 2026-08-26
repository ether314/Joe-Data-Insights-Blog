/**
 * QA: nurse-aide-turnover-versus-five-star-staffing-ratings-2026
 * // smoke-marker: Turnover vs staffing stars
 * // viz-types: star-band grouped bars, turnover-vs-stars scatter, aide-HPRD
 * // composed chart, region dual bars, ownership bars, staffing-point budget bars
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DETAIL_TABLE,
  HEADLINE,
  OWNERSHIP_TURNOVER,
  REGION_AGG,
  STAR_BAND_TURNOVER,
  STATE_PANEL,
  VIZ_MARKERS,
} from "../src/data/nurse-aide-turnover-versus-five-star-staffing-ratings-2026-data.ts";

assert.equal(HEADLINE.nationalNursingTurnoverPct, 45.8);
assert.equal(HEADLINE.turnoverAt1StarPct, 54.7);
assert.equal(HEADLINE.turnoverAt5StarPct, 37.5);
assert.equal(HEADLINE.starSpreadPp, 17.2);
assert.equal(HEADLINE.stateCorrR, -0.74);
assert.ok(STATE_PANEL.length >= 50);
assert.ok(STAR_BAND_TURNOVER.length === 5);
assert.ok(OWNERSHIP_TURNOVER.length === 3);
assert.ok(REGION_AGG.length === 4);
assert.ok(DETAIL_TABLE.length >= 6);
assert.ok(VIZ_MARKERS.includes("Turnover vs staffing stars"));
assert.ok(VIZ_MARKERS.includes("1★ homes 54.7% vs 5★ 37.5%"));

const root = process.cwd();
const slug = "nurse-aide-turnover-versus-five-star-staffing-ratings-2026";
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

    await clickBtn(page, "Star bands");
    await page
      .getByText("1★ homes 54.7% vs 5★ 37.5%", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ 1★ homes 54.7% vs 5★ 37.5%");
    await clickBtn(page, "State scatter");
    await page
      .getByText("State scatter residual map", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Aide vs churn");
    await page
      .getByText("Aide HPRD vs churn", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Regions");
    await page
      .getByText("Census-weighted regional means", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Ownership");
    await page
      .getByText("Ownership and churn", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Point budget");
    await page
      .getByText("Staffing-domain point budget", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Star bands");
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
