/**
 * QA: ai-compute-demand-concentration-2026
 * // viz-types: scoreboard bars, Lorenz area+line, ranked ownership bars, cloud donut, market bands, path multi-line, region bars, token bars, token-vs-owner scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  OWNERS,
  SCOREBOARD,
  TOKEN_BRANDS,
} from "../src/data/ai-compute-demand-concentration-2026-data.ts";

assert.equal(HEADLINE.ownerTop1Pct, 25.0);
assert.equal(HEADLINE.ownerTop3Pct, 54.8);
assert.equal(HEADLINE.ownerBig5Pct, 71.4);
assert.equal(HEADLINE.cloudTop3Pct, 57);
assert.equal(HEADLINE.tokenTop1Pct, 29.2);
assert.equal(OWNERS[0].label, "Google");
assert.equal(OWNERS[0].sharePct, 25.0);
assert.ok(SCOREBOARD.length >= 4);
assert.equal(TOKEN_BRANDS[0].id, "bytedance");

const root = process.cwd();
const slug = "ai-compute-demand-concentration-2026";
const markers = [
  "AI compute demand — concentration lens",
  "Top-1 vs Top-3 across perimeters",
  "Concentration path",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.getByRole("button", { name, exact: true }).click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="ai-compute-demand-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Ownership ladder");
    await page
      .getByText("Ownership ladder (H100e world share)", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Ownership ladder (H100e world share)");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Owners");
    await clickBtn(page, "Sites & regions");
    await clickBtn(page, "Tokens vs chips");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "Cloud / sites");
    await clickBtn(page, "All four");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-compute-demand-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
