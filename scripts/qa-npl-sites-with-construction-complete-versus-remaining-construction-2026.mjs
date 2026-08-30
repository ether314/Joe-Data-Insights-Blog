/**
 * QA: npl-sites-with-construction-complete-versus-remaining-construction-2026
 * // viz-types: donut, horizontal bars, funnel bars, composed dual-axis, area, scatter, pie | layout: default
 * // smoke-marker: Construction-complete share of final NPL
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL_SITEWIDE_CC,
  CONSTRUCTION_ACTIVITY,
  FINAL_NPL_SPLIT,
  HEADLINE,
  MILESTONE_COMPARE,
  NPL_ROSTER,
  PIPELINE_STAGES,
  SAA_STATUS,
  SPLIT_ROWS,
} from "../src/data/npl-sites-with-construction-complete-versus-remaining-construction-2026-data.ts";

assert.equal(NPL_ROSTER.final, 1343);
assert.equal(NPL_ROSTER.deleted, 459);
assert.equal(FINAL_NPL_SPLIT.constructionCompleteOnFinal, 788);
assert.equal(FINAL_NPL_SPLIT.remainingConstruction, 555);
assert.ok(HEADLINE.constructionCompleteSharePct > 58 && HEADLINE.constructionCompleteSharePct < 60);
assert.equal(HEADLINE.fy2025SiteWideCc, 1);
assert.equal(HEADLINE.fy2025ProjectCompletions, 72);
assert.ok(ANNUAL_SITEWIDE_CC.length >= 10);
assert.ok(CONSTRUCTION_ACTIVITY.length >= 4);
assert.ok(PIPELINE_STAGES.length >= 4);
assert.ok(MILESTONE_COMPARE.length >= 4);
assert.ok(SAA_STATUS.length === 2);
assert.ok(SPLIT_ROWS.length === 2);

const root = process.cwd();
const slug = "npl-sites-with-construction-complete-versus-remaining-construction-2026";
const markers = ["Construction-complete share of final NPL"];

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
    await clickBtn(page, "Final NPL split");
    await clickBtn(page, "Final NPL only");
    await clickBtn(page, "Cumulative ever-listed frame");
    await clickBtn(page, "Final + proposed");
    await clickBtn(page, "Pipeline funnel");
    await clickBtn(page, "Annual site-wide CC");
    await clickBtn(page, "Project activity");
    await clickBtn(page, "Protection milestones");
    await clickBtn(page, "SAA status");
    await clickBtn(page, "Final NPL split");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
