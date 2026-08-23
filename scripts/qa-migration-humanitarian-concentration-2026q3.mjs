/**
 * QA: migration-humanitarian-concentration-2026q3
 * // viz-types: Δ scoreboard bars, stickiness dual-line, heal waterfall+pie, HHI bars, scissors bars, UNHCR tip bars, plan leverage scatter, role scatter, vintage multi-line | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  LENS_COMPARE,
  DONOR_SHARES,
  DELTA_SCOREBOARD,
} from "../src/data/migration-humanitarian-concentration-2026q3-data.ts";

assert.equal(HEADLINE.donorTop1Pct, 23.1);
assert.equal(HEADLINE.donorTop3Pct, 44.7);
assert.equal(HEADLINE.ghoCoverageDeltaPp, 16.0);
assert.equal(HEADLINE.donorTop1DeltaPp, 0);
assert.equal(HEADLINE.hostTop3Pct, 18.5);
assert.equal(HEADLINE.incomeLmicPct, 68);
assert.ok(DONOR_SHARES.length >= 10);
assert.ok(LENS_COMPARE.length === 4);
assert.ok(DELTA_SCOREBOARD.length >= 5);

const root = process.cwd();
const slug = "migration-humanitarian-concentration-2026q3";
const markers = [
  "Migration & humanitarian — Q3 concentration lens",
  "Coverage +",
  "What moved vs what stuck",
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
      '[data-viz="migration-humanitarian-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Top-1");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Moved only");
    await clickBtn(page, "All meters");
    await clickBtn(page, "Tip stickiness");
    await page
      .getByText("Coverage rises", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ tip stickiness panel");
    await clickBtn(page, "Heal attribution");
    await clickBtn(page, "Hosts");
    await clickBtn(page, "Agency tip");
    await clickBtn(page, "Plan leverage");
    await clickBtn(page, "Host/donor roles");
    await clickBtn(page, "Plans");
    await clickBtn(page, "Δ scoreboard");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-migration-humanitarian-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
