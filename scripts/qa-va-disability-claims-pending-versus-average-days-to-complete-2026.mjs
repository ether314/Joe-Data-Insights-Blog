/**
 * QA: va-disability-claims-pending-versus-average-days-to-complete-2026
 * // smoke-marker: Pending vs days-to-complete
 * // viz-types: dual-axis pending+ADC composed, backlog-share area, pending-vs-ADC scatter,
 * // EP peak/latest bars, mix pie, FY completions
 * // | controls: panel, window, ADC metric, left series | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  EP_BREAKDOWN,
  HEADLINE,
  SNAPSHOTS,
  VIZ_MARKERS,
} from "../src/data/va-disability-claims-pending-versus-average-days-to-complete-2026-data.ts";

assert.equal(HEADLINE.peakPending, 1_098_487);
assert.equal(HEADLINE.peakBacklog, 417_855);
assert.equal(HEADLINE.latestPending, 632_774);
assert.equal(HEADLINE.latestBacklog, 71_364);
assert.ok(Math.abs(HEADLINE.latestAdcFytd - 76.21) < 0.01);
assert.ok(SNAPSHOTS.length >= 12);
assert.ok(EP_BREAKDOWN.length >= 5);
assert.ok(VIZ_MARKERS.includes("Pending vs days-to-complete"));
assert.ok(VIZ_MARKERS.includes("Peak pending ~1.10M (Oct 2023)"));

const root = process.cwd();
const slug = "va-disability-claims-pending-versus-average-days-to-complete-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4180);
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
      .getByText("Pending fell", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ headline pending drop");

    await clickBtn(page, "Backlog share");
    await page
      .getByText("Backlog share of pending inventory", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Scatter");
    await page
      .getByText("Pending inventory vs ADC FYTD", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "EP ladder");
    await page
      .getByText("End-product pending: peak vs latest", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Claim mix");
    await page
      .getByText("Original vs supplemental mix", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "FY completions");
    await page
      .getByText("Fiscal-year completions", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Pending vs ADC");
    await clickBtn(page, "ADC MTD");
    await clickBtn(page, "Surge window");
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
