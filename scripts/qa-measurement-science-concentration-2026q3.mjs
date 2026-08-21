/**
 * QA: measurement-science-concentration-2026q3
 * // viz-types: HHI bars, Lorenz area+line, converter bars, vintage multi-line, CET bars, volume×impact scatter, sector bars, donut | layout: default
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
  CONVERTER_FRAMES,
} from "../src/data/measurement-science-concentration-2026q3-data.ts";

assert.equal(HEADLINE.gerdTop1Pct, 29.4);
assert.equal(HEADLINE.gerdTop3Pct, 65.2);
assert.equal(HEADLINE.gerdGapPp, 0.3);
assert.equal(HEADLINE.nonOecdChinaPct, 92.3);
assert.equal(HEADLINE.cetAiTop1Pct, 75);
assert.equal(HEADLINE.businessBerdGapBn, 100);
assert.equal(SCOREBOARD[0].id, "gerd");
assert.equal(GERD_LADDER[0].name, "China");
assert.equal(CONVERTER_FRAMES[0].chinaVsUsPct, 102);
assert.ok(GERD_LADDER[0].sharePct > 29);

const root = process.cwd();
const slug = "measurement-science-concentration-2026q3";
const markers = [
  "Measurement & science — Q3 2026 concentration lens",
  "HHI by concentration lens",
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
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
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
      '[data-viz="measurement-science-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Ladder + Lorenz");
    await page
      .getByText("Concentration curve vs equal split", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Concentration curve vs equal split");
    await clickBtn(page, "Pubs");
    await clickBtn(page, "Cumulative");
    await clickBtn(page, "Non-OECD");
    await clickBtn(page, "Converter frames");
    await clickBtn(page, "Vintage + impact");
    await clickBtn(page, "HHI / scoreboard");
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
