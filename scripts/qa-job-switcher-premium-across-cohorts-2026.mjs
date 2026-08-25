/**
 * QA: job-switcher-premium-across-cohorts-2026
 * // smoke-marker: Switcher−stayer premium
 * // viz-types: composed premium path+JOLTS, industry ladder bars,
 * // quits×premium scatter, industry heat grid, cohort grouped bars,
 * // peak-vs-now composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGE_COHORTS,
  EDU_COHORTS,
  HEADLINE,
  INDUSTRIES,
  NATIONAL_PATH,
  VIZ_MARKERS,
} from "../src/data/job-switcher-premium-across-cohorts-2026-data.ts";

assert.equal(HEADLINE.latestPremiumPp, 0.8);
assert.equal(HEADLINE.peakPremiumPp, 2.6);
assert.equal(HEADLINE.industriesStoppedPaying, 4);
assert.equal(HEADLINE.latestSwitcherPct, 4.4);
assert.equal(HEADLINE.latestStayerPct, 3.6);
assert.ok(
  Math.abs(
    HEADLINE.latestSwitcherPct -
      HEADLINE.latestStayerPct -
      HEADLINE.latestPremiumPp,
  ) < 0.05,
);
assert.ok(NATIONAL_PATH.length >= 12);
assert.ok(INDUSTRIES.length >= 8);
assert.ok(AGE_COHORTS.length >= 4);
assert.ok(EDU_COHORTS.length >= 4);
assert.equal(
  INDUSTRIES.filter((i) => i.stoppedPaying).length,
  HEADLINE.industriesStoppedPaying,
);

const root = process.cwd();
const slug = "job-switcher-premium-across-cohorts-2026";
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

    await clickBtn(page, "Industry ladder");
    await page
      .getByText("Industry ladder — latest premium", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Quits × premium");
    await page
      .getByText("JOLTS quits × switcher premium", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Industry heat");
    await page
      .getByText("Industry premium heat", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Cohort cut");
    await clickBtn(page, "Education");
    await clickBtn(page, "Age");
    await clickBtn(page, "Peak vs now");
    await page
      .getByText("Peak vs now — compression", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Switcher−stayer premium");

    await auditVizInteractions(page, { slug });
    console.log("✓ viz interaction audit");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
  console.log(`\nQA passed: ${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
