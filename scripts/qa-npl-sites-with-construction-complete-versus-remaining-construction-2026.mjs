/**
 * QA: npl-sites-with-construction-complete-versus-remaining-construction-2026
 * // viz-types: horizontal bars, donut pie, composed area+bar+line, stacked bars+line, stacked lead bars, milestone bars, funding scatter | layout: default
 * // smoke-marker: Headline — 58.7% of final NPL construction-complete
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_SITEWIDE_CC,
  FINAL_NPL_SPLIT,
  HEADLINE,
  LEAD_MIX,
  MILESTONE_LADDER,
  PROJECT_FLOW,
  STATUS_UNIVERSE,
  SUMMARY_TABLE,
} from "../src/data/npl-sites-with-construction-complete-versus-remaining-construction-2026-data.ts";

assert.equal(HEADLINE.finalNpl, 1343);
assert.equal(HEADLINE.cumulativeCc, 1247);
assert.equal(HEADLINE.ccOnFinalNpl, 788);
assert.equal(HEADLINE.unfinishedOnFinalNpl, 555);
assert.equal(HEADLINE.ccSharePct, 58.7);
assert.equal(HEADLINE.unfinishedSharePct, 41.3);
assert.equal(FINAL_NPL_SPLIT.length, 2);
assert.equal(STATUS_UNIVERSE.length, 4);
assert.ok(ANNUAL_SITEWIDE_CC.length >= 8);
assert.equal(PROJECT_FLOW.length, 2);
assert.equal(LEAD_MIX.length, 2);
assert.ok(MILESTONE_LADDER.length >= 5);
assert.ok(SUMMARY_TABLE.length >= 8);
assert.equal(ANALYTICS.unfinishedSites, 555);

const root = process.cwd();
const slug =
  "npl-sites-with-construction-complete-versus-remaining-construction-2026";
const markers = [
  "Headline — 58.7% of final NPL construction-complete",
  "Final NPL split",
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
    await clickBtn(page, "Status universe");
    await clickBtn(page, "CC cumulative path");
    await clickBtn(page, "Project vs sitewide");
    await clickBtn(page, "Who leads starts");
    await clickBtn(page, "Milestone ladder");
    await clickBtn(page, "Funding vs flow");
    await clickBtn(page, "Final NPL split");
    await clickBtn(page, "Final + deleted");
    await clickBtn(page, "FY2020–2025");
    await clickBtn(page, "Final NPL only");
    await clickBtn(page, "FY2016–2025");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed", err);
  process.exit(1);
});
