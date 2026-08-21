/**
 * QA: measurement-science-concentration-2026
 * // viz-types: scoreboard bars, Lorenz area+line, ranked ladder bars, CET field bars, path multi-line, donut, volume×impact scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  SCOREBOARD,
  GERD_LADDER,
} from "../src/data/measurement-science-concentration-2026-data.ts";

assert.equal(HEADLINE.gerdTop1Pct, 29.4);
assert.equal(HEADLINE.gerdTop3Pct, 65.2);
assert.equal(HEADLINE.pubsTop3Pct, 50);
assert.equal(HEADLINE.cetAiTop1Pct, 75);
assert.equal(HEADLINE.ktiTop1Pct, 28);
assert.equal(SCOREBOARD[0].id, "gerd");
assert.equal(GERD_LADDER[0].name, "China");
assert.ok(GERD_LADDER[0].sharePct > 29);

const root = process.cwd();
const slug = "measurement-science-concentration-2026";
const markers = [
  "Measurement & science — concentration lens",
  "Top-1 vs Top-3 by perimeter",
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
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}`,
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
    if (!loaded) {
      console.error("✗ Failed to load post HTML");
      process.exit(1);
    }
    await page.waitForSelector(
      '[data-viz="measurement-science-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Concentration ladder");
    await page
      .getByText("Cumulative share vs equal split", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Cumulative share vs equal split");
    await clickBtn(page, "Publications");
    await clickBtn(page, "Cumulative");
    await clickBtn(page, "CET patents");
    await clickBtn(page, "Volume vs impact");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "Publication shares");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`qa-${slug}: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
