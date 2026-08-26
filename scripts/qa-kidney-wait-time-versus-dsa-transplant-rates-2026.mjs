/**
 * QA: kidney-wait-time-versus-dsa-transplant-rates-2026
 * // smoke-marker: Median wait 61→58 months after KAS250
 * // viz-types: dual-line national path, grouped center-tier bars, DSA wait bars,
 * // wait-vs-rate scatter, division mortality bars, MIRR compression bars
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CENTER_TIERS,
  DETAIL_TABLE,
  DSA_SAMPLE,
  HEADLINE,
  MIRR_PATH,
  NATIONAL_PATH,
  VIZ_MARKERS,
} from "../src/data/kidney-wait-time-versus-dsa-transplant-rates-2026-data.ts";

assert.equal(HEADLINE.nationalWaitPre, 61);
assert.equal(HEADLINE.nationalWaitPost, 58);
assert.equal(HEADLINE.remainingCenterGapMonths, 20);
assert.equal(HEADLINE.dsaMirrPre, 1.35);
assert.equal(HEADLINE.dsaMirrPost, 1.17);
assert.ok(NATIONAL_PATH.length >= 6);
assert.ok(CENTER_TIERS.length === 3);
assert.ok(DSA_SAMPLE.length >= 15);
assert.ok(DETAIL_TABLE.length >= 15);
assert.ok(MIRR_PATH.length === 2);
assert.ok(VIZ_MARKERS.includes("Median wait 61→58 months after KAS250"));
assert.ok(VIZ_MARKERS.includes("Wait vs DDKT-rate scatter by DSA"));

const root = process.cwd();
const slug = "kidney-wait-time-versus-dsa-transplant-rates-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4184);
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

    await clickBtn(page, "Center tiers");
    await page
      .getByText("LWT vs SWT wait gap still ~20 months", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ LWT vs SWT wait gap still ~20 months");
    await clickBtn(page, "DSA waits");
    await page
      .getByText("Median wait months by DSA", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Wait vs rate");
    await page
      .getByText("Wait vs DDKT-rate scatter by DSA", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Division mortality");
    await page
      .getByText("Pretransplant mortality 2.5–7.0 by DSA", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "MIRR gap");
    await page
      .getByText("DSA transplant-rate MIRR 1.35→1.17", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "National path");
    console.log("✓ view controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
