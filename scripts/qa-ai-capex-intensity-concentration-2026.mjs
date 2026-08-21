/**
 * QA: ai-capex-intensity-concentration-2026
 * // viz-types: Lorenz area+line, ranked intensity bars, excess donut, path multi-line, perimeter compare bars, intensity-FCF scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  SHARE_LADDER_AUG20,
  EXCESS_SLICES,
} from "../src/data/ai-capex-intensity-concentration-2026-data.ts";

assert.equal(HEADLINE.top1SharePct, 26.7);
assert.equal(HEADLINE.top3SharePct, 69);
assert.equal(HEADLINE.top1Label, "Oracle");
assert.equal(HEADLINE.top1IntensityPct, 43.5);
assert.equal(HEADLINE.hhi, 2121);
assert.equal(HEADLINE.dollarTop1Label, "Amazon");
assert.ok(HEADLINE.dollarTop1SharePct > 30);
assert.equal(SHARE_LADDER_AUG20[0].company, "Oracle");
assert.equal(SHARE_LADDER_AUG20[0].sharePct, 26.7);
assert.ok(EXCESS_SLICES.length >= 3);

const root = process.cwd();
const slug = "ai-capex-intensity-concentration-2026";
const dashboardPath = path.join(
  root,
  "src/components/visualizations/AiCapexIntensityConcentrationDashboard.tsx",
);
const dashboardSrc = fs.readFileSync(dashboardPath, "utf8");
assert.ok(
  dashboardSrc.includes('data-viz="ai-capex-intensity-concentration-2026"'),
  "Dashboard missing data-viz marker",
);

const markers = [
  "Capex intensity — concentration lens",
  "Cumulative share vs equal split",
  "Ranked intensity & concentration share",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="ai-capex-intensity-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Multi-year path");
    await clickBtn(page, "Excess concentration");
    await clickBtn(page, "Sustainability");
    await page
      .getByText("Intensity vs free-cash-flow margin", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Intensity vs free-cash-flow margin");
    await clickBtn(page, "Intensity ladder");
    await clickBtn(page, "FY25");
    await clickBtn(page, "Late-Aug");
    await clickBtn(page, "Excess vs cloud norm");
    await clickBtn(page, "Capex-dollar shares");
    await clickBtn(page, "Intensity-sum shares");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-capex-intensity-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
