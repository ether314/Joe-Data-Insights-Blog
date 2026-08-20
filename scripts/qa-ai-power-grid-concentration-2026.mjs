/**
 * QA: ai-power-grid-concentration-2026
 * // viz-types: concentration Lorenz area+line, ranked share bars, growth donut, cluster scatter, intensity bars, pace clocks | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_SHARES,
  TOP_CLUSTERS,
} from "../src/data/ai-power-grid-concentration-2026-data.ts";

assert.equal(HEADLINE.top1Share2024Pct, 45);
assert.equal(HEADLINE.top3Share2024Pct, 85);
assert.equal(HEADLINE.usChinaGrowthSharePct, 80);
assert.equal(HEADLINE.virginiaDcSharePct, 25);
assert.equal(HEADLINE.irelandDcSharePct, 20);
assert.equal(HEADLINE.projectsAtDelayRiskPct, 20);
assert.equal(REGION_SHARES[0].share2024Pct, 45);
assert.equal(TOP_CLUSTERS[0].cluster, "Northern Virginia");
assert.equal(TOP_CLUSTERS[0].itLoadGw, 4.9);

const root = process.cwd();
const slug = "ai-power-grid-concentration-2026";
const markers = [
  "AI power & grid — concentration lens",
  "Cumulative share vs equal split",
  "Who captures growth to 2030",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector('[data-viz="ai-power-grid-concentration-2026"]', {
      timeout: 20000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "2024 TWh");
    await clickBtn(page, "Growth to 2030");
    await clickBtn(page, "Clusters");
    await clickBtn(page, "Pipeline %");
    await clickBtn(page, "Local intensity");
    await clickBtn(page, "Grid pace");
    await clickBtn(page, "Concentration ladder");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-power-grid-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
