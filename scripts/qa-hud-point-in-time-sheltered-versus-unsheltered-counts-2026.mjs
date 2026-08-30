/**
 * QA: hud-point-in-time-sheltered-versus-unsheltered-counts-2026
 * // smoke-marker: Sheltered vs unsheltered stack
 * // viz-types: stacked area, waterfall bars, donut, state mix bars, ES/TH pie, household grouped
 * // | controls: panel, window, metric/focus
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  HOUSEHOLD_MIX_2024,
  INCREASE_SHARE,
  STATE_MIX_2024,
  VIZ_MARKERS,
  YEARLY,
  validateHeadlineInvariants,
} from "../src/data/hud-point-in-time-sheltered-versus-unsheltered-counts-2026-data.ts";

assert.equal(HEADLINE.increase2023to2024, 118_376);
assert.equal(HEADLINE.shelteredDelta2023to2024, 100_762);
assert.equal(HEADLINE.unshelteredDelta2023to2024, 17_614);
assert.equal(HEADLINE.shelteredShareOfIncreasePct, 85.1);
assert.equal(HEADLINE.year2024Total, 771_480);
assert.equal(HEADLINE.year2025Total, 745_652);
assert.ok(YEARLY.length >= 15);
assert.ok(STATE_MIX_2024.length >= 8);
assert.ok(HOUSEHOLD_MIX_2024.length === 3);
assert.ok(INCREASE_SHARE.length === 2);
assert.ok(validateHeadlineInvariants());

const root = process.cwd();
const slug = "hud-point-in-time-sheltered-versus-unsheltered-counts-2026";
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

    await clickBtn(page, "Increase waterfall");
    await page
      .getByText("Increase waterfall", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Increase share donut");
    await clickBtn(page, "State shelter mix");
    await clickBtn(page, "ES / TH / street split");
    await clickBtn(page, "Household-type mix");
    await clickBtn(page, "Sheltered vs unsheltered stack");
    await clickBtn(page, "People (levels)");
    await clickBtn(page, "Unsheltered %");
    await clickBtn(page, "YoY change");
    await clickBtn(page, "2007–2025");
    await clickBtn(page, "Increase waterfall");
    await clickBtn(page, "2024→2025 decline");

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
