/**
 * QA: cso-communities-versus-remaining-overflow-volume-2026
 * // viz-types: composed dual-axis, scatter, area timeline, horizontal CWNS bars, scenario composed | layout: default
 * // smoke-marker: Combined sewer overflows · communities vs volume
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CWNS_CATEGORIES,
  DUAL_AXIS,
  HEADLINE,
  NATIONAL_TIMELINE,
  REGION_COMMUNITIES,
  STATE_BENCHMARKS,
  VOLUME_SCENARIOS,
} from "../src/data/cso-communities-versus-remaining-overflow-volume-2026-data.ts";

assert.equal(HEADLINE.communitiesRemaining, 700);
assert.equal(HEADLINE.nationalVolumeBgY, 850);
assert.equal(HEADLINE.cwnsCsoNeedsBb, 36.5);
assert.equal(HEADLINE.greatLakesCommunities, 158);
assert.ok(REGION_COMMUNITIES.length === 6);
assert.ok(DUAL_AXIS.length === 6);
assert.ok(NATIONAL_TIMELINE.length >= 5);
assert.ok(CWNS_CATEGORIES.some((c) => c.isCso && c.needsBb === 36.5));
assert.ok(VOLUME_SCENARIOS.length === 4);
assert.ok(STATE_BENCHMARKS.length >= 4);
assert.equal(
  REGION_COMMUNITIES.reduce((s, r) => s + r.communities, 0),
  700,
);

const root = process.cwd();
const slug = "cso-communities-versus-remaining-overflow-volume-2026";
const markers = ["Combined sewer overflows · communities vs volume"];

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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Dual axis");
    await clickBtn(page, "Great Lakes Basin");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Illustrative Cat. V needs ($B)");
    await clickBtn(page, "Residual volume (BG)");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Timeline");
    await clickBtn(page, "CWNS needs");
    await clickBtn(page, "Volume scenarios");
    await clickBtn(page, "Modest national cut (−25%)");
    await clickBtn(page, "All scenarios");
    await clickBtn(page, "State benches");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
